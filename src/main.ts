import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { ArgumentBuilder } from '@akiojin/argument-builder'

async function Run(): Promise<void> 
{
	try {
		const output = core.getInput('output')

		const builder = new ArgumentBuilder()
		builder.Append('build')
		builder.Append('--configuration', core.getInput('configuration'))
		builder.Append('--output', output)

		await exec.exec('dotnet', builder.Build())

		if (!!core.getBooleanInput('publish')) {
			const builder = new ArgumentBuilder()
			builder.Append('nuget', 'push')
			builder.Append(`${output}/*.nupkg`)
			builder.Append('--source', `"${core.getInput('source')}"`)
			builder.Append('--api-key', core.getInput('api-key'))

			await exec.exec('dotnet', builder.Build())
		}
	} catch (ex: any) {
		core.setFailed(ex.message);
	}
}

Run()
