<template>
    <header>
        <div class="header-wrapper">
            <div class="header-left">
                <h1 class="title">Movie Match!</h1>
                <h3 class="subtitle">See what projects different artists worked on together</h3>
            </div>
            <div class="header-right">
                <button>Log In</button>
                <button>Give me money, please</button>
            </div>

        </div>

    </header>

    <!-- output page content -->
    <div>
        <slot />
    </div>
</template>

<style scoped>
    body {
        margin: 10px;
    }
    header {
        height: auto;
    }
    .header-wrapper {
        overflow: hidden;
        background-color: #f1f1f1;
        padding: 20px 10px;
    }
    .header-left {
        float: left;
        color: black;
        text-align: center;
        margin: 12px;
        text-decoration: none;
        font-size: 18px;
        line-height: 25px;
        border-radius: 4px;
        width: 50%;
        display: flex;
    }
    .header-right {
        float: right;
        width: 25%;
    }
    .header-right button {
        cursor: pointer;
        outline: 0px;
        background-color: black;
        color: white;
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        float: right;
    }
    .title {
        font-size: 50px;
        font-weight: bold;
        height: 100%;
    }
    .subtitle {
        font-size: 20px;
        text-align: center;
    }
</style>