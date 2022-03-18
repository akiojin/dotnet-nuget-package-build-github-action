import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { ArgumentBuilder } from '@akiojin/argument-builder'

async function Run(): Promise<void> 
{
	try {
		const apiKey = core.getInput('api-key')
		const output = core.getInput('output')
		const source = core.getInput('source')
		const publish = core.getBooleanInput('publish')

		if (!!publish) {
			if (apiKey === '') {
				throw new Error('api-key is null')
			}
			if (source === '') {
				throw new Error('source is null')
			}
		}

		const builder = new ArgumentBuilder()
		builder.Append('build')
		builder.Append('--configuration', core.getInput('configuration'))
		builder.Append('--output', output)

		await exec.exec('dotnet', builder.Build())

		if (!!publish) {
			const builder = new ArgumentBuilder()
			builder.Append('nuget', 'push')
			builder.Append(`${output}/*.nupkg`)
			builder.Append('--source', `"${source}"`)
			builder.Append('--api-key', apiKey)

			await exec.exec('dotnet', builder.Build())
		}
	} catch (ex: any) {
		core.setFailed(ex.message);
	}
}

Run()
