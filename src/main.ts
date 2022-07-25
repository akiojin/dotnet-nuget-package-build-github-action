import * as core from '@actions/core'
import * as exec from '@actions/exec'
import path from 'path'
import { ArgumentBuilder } from '@akiojin/argument-builder'

class DotNet
{
	static async AddSource(name: string, source: string, username: string, password: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('nuget')
			.Append('add')
			.Append('source')
			.Append('--username', username)
			.Append('--password', password)
			.Append('--store-password-in-clear-text')
			.Append('--name', `"${name}"`)
			.Append(source)

		return exec.exec('dotnet', builder.Build())
	}

	static async RemoveSource(name: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('nuget')
			.Append('remove')
			.Append('source', `"${name}"`)

		return exec.exec('dotnet', builder.Build())
	}

	static async Build(output: string, configuration: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('build')
			.Append('--configuration', configuration)
			.Append('--output', output)

		return exec.exec('dotnet', builder.Build())
	}

	static async Publish(output: string, source: string, apiKey: string): Promise<number>
	{
		const builder = new ArgumentBuilder()
			.Append('nuget', 'push')
			.Append(path.join(output, '*.nupkg'))
			.Append('--source', `${source}`)
			.Append('--api-key', apiKey)

		return exec.exec('dotnet', builder.Build())
	}
}

async function Run(): Promise<void> 
{
	try {
		const output = core.getInput('output')
		await DotNet.Build(output, core.getInput('configuration'))

		if (!!core.getBooleanInput('publish')) {
			await DotNet.Publish(output, core.getInput('source'), core.getInput('api-key'))
		}
	} catch (ex: any) {
		core.setFailed(ex.message);
	}
}

Run()
