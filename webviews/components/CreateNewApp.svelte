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
    import { onMount } from "svelte";


    function createProject() {
        tsvscode.postMessage({
            type: "onCreateApp",
            value: { projectName: projectName, projectPath: projectPath, solutionName: solutionName }
        });
    }

    onMount(() => {
        window.addEventListener("message", (event) => {
            const message = event.data;

            switch(message.type) {
                case "setHomeFolder":
                    projectPath = message.value;
                    break;
            }
        });
    });

    let projectName = "";
    let solutionName = "";
    let projectPath = "";

    // let projectPath = process.env.HOME;
</script>

<div class="center">
    <h1>
        Create new Avalonia .NET Core App
    </h1>

    <div class="rowElement">
        <div class="elementText">Project Name</div>
        <input bind:value="{projectName}" />
    </div>

    <div class="rowElement">
        <div class="elementText">Project Path</div>
        <input bind:value="{projectPath}" />
    </div>

    <!-- <div class="rowElement">
        <div class="elementText">Suggested Solution name</div>
        <input bind:value="{solutionName}" />
    </div> -->

    <div class="rowButton">
        <button on:click={createProject}>Create</button>
    </div>
</div>

