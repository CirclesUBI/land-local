const express = require("express");
const Docker = require("dockerode");

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });

        const result = containers.map((container) => {
            return {
                id: container.Id,
                name: container.Names[0],
                image: container.Image,
                status: container.Status,
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while fetching container status" });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
