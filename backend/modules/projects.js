const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema(
    {
        projectName: { type: String, require: true },
        image: { type: Object, require: true },
        imageUrl: { type: Object, require: true },
        projectCost: { type: Number, require: true },
        projectDescription: { type: Object, require: true },
    },
    {
        timestamps: true,
    }
);

const Projects = mongoose.model("Projects", projectsSchema);

exports.Projects = Projects;