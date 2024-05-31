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
    .header-wrapper {
        display: flex;
        height: 7em;
    }
    .header-left {
        display: flex
    }
    .header-right {
        float: left;
        display: flex
    }
    .title {
        font-size: 3vw;
        display: flex;
        align-items: flex-end; 
        margin: 5px;
    }
    .subtitle {
        display: flex;
        align-items: flex-end; 
        margin: 5px;
    }
</style>