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
            type: "onCreateCrossApp",
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
        Create new Avalonia Cross Platform .NET Core Application
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

    <div>
        <br />
        <br />
        <h2>NOTE:</h2> 
        <p>Please make sure that <b>wasm-tools</b> workload are installed in your system.</p>
        <br />
        <h2>Windows</h2>
        <p>C:\ dotnet workload install wasm-tools</p>
        <br />
        <h2>Linux</h2>
        <p># sudo dotnet workload install wasm-tools</p>
        <br />
        <h2>Mac</h2>
        <p># sudo dotnet workload install wasm-tools</p>
    </div>
</div>

