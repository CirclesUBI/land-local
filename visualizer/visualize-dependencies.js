const fs = require('fs');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const args = process.argv.slice(2);

const inputFile = args[0];
const outputFile = args[1];

try {
    const fileContents = fs.readFileSync(inputFile, 'utf8');
    const doc = yaml.load(fileContents);
    const services = doc.services;

    let c4 = '@startuml\n!include <C4/C4_Container>\n\n';
    let containers = [];

    for (const [serviceName, service] of Object.entries(services)) {
        if (service.build) {
            c4 += `WithoutPropertyHeader()\n`;

            if (service.ports) {
                for (const port of service.ports) {
                    c4 += `AddProperty("ports", "${port}")\n`;
                }
            }

            if (service.volumes) {
                for (const volume of service.volumes) {
                    c4 += `AddProperty("volume", "${volume}")\n`;
                }
            }

            c4 += `Container(${serviceName.replace(/-/g, "_")}, "${serviceName}")\n`;
            containers.push(serviceName);
        }

        if (service.image) {
            c4 += `WithoutPropertyHeader()\n`;

            if (service.ports) {
                for (const port of service.ports) {
                    c4 += `AddProperty("ports", "${port}")\n`;
                }
            }

            if (service.volumes) {
                for (const volume of service.volumes) {
                    c4 += `AddProperty("volume", "${volume}")\n`;
                }
            }

            c4 += `Container(${serviceName.replace(/-/g, "_")}, "${serviceName}")\n`;
            containers.push(serviceName);
        }
    }

    for (const [serviceName, service] of Object.entries(services)) {
        if (service.depends_on) {
            if (typeof service.depends_on === 'string') {
                c4 += `Rel_D(${serviceName.replace(/-/g, "_")}, ${service.depends_on.replace(/-/g, "_")}, "depends-on", "")\n`;
            } else if (Array.isArray(service.depends_on)) {
                for (const dep of service.depends_on) {
                    c4 += `Rel_D(${serviceName.replace(/-/g, "_")}, ${dep.replace(/-/g, "_")}, "depends-on", "")\n`;
                }
            } else if (typeof service.depends_on === 'object') {
                for (const [depName, depCondition] of Object.entries(service.depends_on)) {
                    c4 += `Rel_D(${serviceName.replace(/-/g, "_")}, ${depName.replace(/-/g, "_")}, "when: \n${depCondition.condition}", "")\n`;
                }
            }
        }
    }

    c4 += '\n@enduml';
    // regex replace 'n: \n' with 'n: '
    c4 = c4.replace(/n: \n/g, 'n: ');



    fs.writeFileSync(`${outputFile}.puml`, c4, 'utf8');

    exec(`dot -Tpng ${outputFile}.dot -o ${outputFile}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }

        console.log(`PNG file generated at ${outputFile}`);
    });

} catch (e) {
    console.log(e);
}
