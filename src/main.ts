import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function Run(): Promise<void> 
{
	try {
		const configuration: string = core.getInput('configuration')
		const apiKey: string = core.getInput('api-key')
		const output: string = core.getInput('output') || process.env.RUNNER_TEMP || __dirname
		const source: string = core.getInput('source')
		const publish: boolean = core.getBooleanInput('publish')

		if (!!publish && apiKey === '') {
			throw new Error('api-key is null')
		}
		if (!!publish && source === '') {
			throw new Error('source is null')
		}

		await exec.exec('dotnet', ['build', '--configuration', configuration, '--output', output])

		if (!!publish) {
			await exec.exec('dotnet', ['nuget', 'push', `"${output}/*.nupkg"`, '--source', `"${source}"`, '--api-key', apiKey])
		}
	} catch (ex: any) {
		core.setFailed(ex.message);
	}
}

Run()
