<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><nav-inventario/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Alteración de parametros de artículos"/>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import tituloh5 from "../../../components/tituloh5";
    import navInventario from "../../../components/navInventario";
    export default {
        name: "parametros",
        components:{tituloh5, navInventario}
    }
</script>

<style scoped>

</style>
