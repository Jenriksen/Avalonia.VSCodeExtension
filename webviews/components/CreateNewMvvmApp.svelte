<style>
    .center {
        margin: auto;
        width: 60%;
        padding: 10px;
    }

    .rowElement {
        box-sizing: border-box;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .elementText {
        box-sizing: border-box;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .rowButton {
        box-sizing: border-box;
        padding-top: 20px;
    }
</style>

<script lang="ts">
    // import * as vscode from "vscode";

    function createProject() {
        tsvscode.postMessage({
            type: "onInfo",
            value: "Creating the Avalonia MVVM App " + projectName,
        });
    }

    let projectName = "";
    let solutionName = "";
    let projectPath = "";
</script>

<div class="center">
    <h1>
        Create new Avalonia .NET Core MVVM App
    </h1>

    <div class="rowElement">
        <div class="elementText">Project Name</div>
        <input bind:value="{projectName}" />
    </div>

    <div class="rowElement">
        <div class="elementText">Project Path</div>
        <input bind:value="{projectPath}" />
    </div>

    <div class="rowElement">
        <div class="elementText">Suggested Solution name</div>
        <input bind:value="{solutionName}" />
    </div>

    <div class="rowButton">
        <button on:click={createProject}>Create</button>
    </div>

    <!-- <div class="rowButton">
        <button on:click={() => {
            tsvscode.postMessage({
                type: "onInfo",
                value: "Creating the Avalonia MVVM App " + projectName
            })
        }}>Create</button>
    </div> -->

    <div>project name: {projectName}</div>
</div>

