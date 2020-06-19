<template>
    <div class="col-auto">
        <div class="contenedorItemMenu">
            <div v-for="item in Items" class="row" v-if="item.per"><div class="col">
                <vs-button size="small" :icon="item.icon" type="line" style="height: 27px;" @click="goUrl(item.url)">
                    {{item.nombre}}
                </vs-button>
            </div></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "item2",
        props:{
            Items: Array,
        },
        methods:{
            goUrl(url){
                this.$router.replace({path:url})
            }
        }
    }
</script>

<style scoped lang="stylus">
.contenedorItemMenu
    height 84px
    width 100%
    padding 1px
    font-size 16px
.contenedorItem2Menu
    height 20px
    width 100%
    padding 1px
    font-size 13px
</style>
