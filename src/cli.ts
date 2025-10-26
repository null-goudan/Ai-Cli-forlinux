import { cli } from 'cleye';
// import { red } from 'kolorist';
import { version } from '../package.json';

cli(
    {
        version,
        description: 'AI CLI for Linux',
    },
    (argv) => {
        console.log('AI CLI for Linux version:', version);
    }
)