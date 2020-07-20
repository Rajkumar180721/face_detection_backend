import fs from 'fs';

let count = 0, c = 0;
console.time('Total time');
let data = fs.readFileSync('./input.txt', 'utf-8');
for (const ch of data){
    if( ch === '(')
        count++;
    else
        count--;
    c++;
    if(count === -1)
        break;
}
console.timeEnd('Total time')
console.log(c);