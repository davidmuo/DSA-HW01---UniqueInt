const fs = require('fs');
const path = require('path');

class UniqueInt {
    constructor() {
        this.offset = 1023;
        this.seen = new Array(2047).fill(false);
    }

    isValidIntegerLine(line) {
        const parts = line.trim().split(/\s+/);
        if (parts.length !== 1) return false;

        const num = parseInt(parts[0], 10);
        return !isNaN(num) && Number.isInteger(num);
    }

    processFile(inputPath, outputPath) {
        this.seen.fill(false);

        const startTime = Date.now(); 

        const fileContent = fs.readFileSync(inputPath, 'utf-8');
        const lines = fileContent.split(/\r?\n/);

        for (const line of lines) {
            if (!this.isValidIntegerLine(line)) continue;

            const num = parseInt(line.trim(), 10);
            const index = num + this.offset;
            this.seen[index] = true;
        }

        const result = [];
        for (let i = 0; i < this.seen.length; i++) {
            if (this.seen[i]) {
                result.push(i - this.offset);
            }
        }

        fs.writeFileSync(outputPath, result.join('\n'), 'utf-8');

        const endTime = Date.now(); 
        const memoryUsedKB = Math.round(process.memoryUsage().heapUsed / 1024);

        console.log(`✅ Processed: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`⏱️ Time taken: ${endTime - startTime} ms`);
        console.log(`💾 Memory used: ${memoryUsedKB} KB`);
        console.log('--------------------------------------');
    }
}

const inputDir = path.join(__dirname, '../../sample_inputs');
const outputDir = path.join(__dirname, '../../sample_results');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const processor = new UniqueInt();

fs.readdirSync(inputDir).forEach((filename) => {
    const inputFile = path.join(inputDir, filename);
    const outputFile = path.join(outputDir, `${filename}_result.txt`);
    processor.processFile(inputFile, outputFile);
});
