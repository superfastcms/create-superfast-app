#! /usr/bin/env node

import { Argument, Command, Option } from 'commander';
import packageJson from './package.json';
import chalk from 'chalk';
import { copyRemoteTemplate, copyToProject, installProject } from './helpers/utils';
import Output from "./helpers/output";

const program = new Command();

program.version(packageJson.version, '-v, --version');
program.usage(
  `${chalk.blue('project-directory')} [options]`
);

// Arguments
program.addArgument(
  new Argument('<project-directory>', 'specify path for create-superfast-app').argOptional().default('create-superfast-app')
);

// Options
program.addOption(
  new Option('-d, --docker <type>', 'default docker file to be included with the set-up')
    .default('mariadb')
    .choices(['mariadb', 'postgres', 'mysql'])
);

program.addOption(
  new Option('-t, --template <template>', 'use one of superfast starter templates ex. "next-blog"')
    .default(null)
)

program.parse(process.argv);

(async () => {
  const projectDirectory = program.processedArgs[0];
  const dockerConfig = program.opts<any>().docker;
  const template = program.opts<any>().template;

  if (template) {
    await copyRemoteTemplate(projectDirectory, template);
  } else {
    await copyToProject(projectDirectory, dockerConfig)
  }

  await installProject(projectDirectory);
  Output.nextSteps(projectDirectory);
})();

