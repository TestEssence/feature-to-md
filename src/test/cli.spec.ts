import test  from 'ava';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { readFileSync  } from 'fs';

test('compile the feature.example to markdown using --basedir', (t) => {
    const cmd = [
        resolve(__dirname, '..', '..', 'node_modules', '.bin', 'ts-node'), // ts-node binary
        resolve(__dirname, '..', 'cli'), // feature-to-md cli script (typescript)
        resolve(__dirname, 'features', 'example.feature'), // file to convert
        '--basedir',
        resolve(__dirname, 'features'),
    ].join(' ');
    console.log('command: '+cmd);
    t.notThrows(() => execSync(cmd));
    t.notThrows(() => readFileSync(resolve(__dirname, 'features', 'example.feature'), 'utf-8'));
});