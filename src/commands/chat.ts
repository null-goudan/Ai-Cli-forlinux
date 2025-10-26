import { command } from 'cleye';
import { spinner, intro, outro, text, isCancel } from '@clack/prompts'; // clack 是个开源项目能够帮助我们更方便地进行命令行交互
import { cyan, green } from 'kolorist';
// import os from 'os';

export default command(
  {
    name: 'chat',
    help: {
      description:
        'Start a new chat session to send and receive messages, continue replying until the user chooses to exit.',
    },
  },
  async () => {
    console.log('');
    intro('Starting new conversation');
    const prompt = async () => {
      const msgYou = `'You':`;
      const userPrompt = (await text({
        message: `${cyan(msgYou)}`,
        placeholder: `send a message ('exit' to quit)`,
        validate: (value) => {
          if (!value) return 'Please enter a prompt.';
        },
      })) as string;

      if (isCancel(userPrompt) || userPrompt === 'exit') {
        outro('Goodbye!');
        process.exit(0);
      }

      const infoSpin = spinner();
      infoSpin.start(`THINKING...`);

      infoSpin.stop(`'AI CLI for linux:'`);
      prompt();
    };
  }
);
