<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <vs-tabs v-if="permisos.includes(35)">
                    <div v-if="">
                        <vs-tab label="Marcas">
                            <marcas/>
                        </vs-tab>
                    </div>
                    <div v-if="permisos.includes(36)">
                        <vs-tab label="Familias">
                            <familias/>
                        </vs-tab>
                        <vs-tab label="Sub-familias">
                            <subfamilias/>
                        </vs-tab>
                    </div>
                </vs-tabs>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../../components/menus/sideColaboradores";
    import marcas from "./marcas";
    import modelos from "./modelos";
    import familias from "./familias";
    import subfamilias from "./subfamilias";
    export default {
        name: "nuevo",
        components:{sideColaboradores, marcas, modelos, familias, subfamilias},
        computed:{
            permisos:function () {
                return this.$store.state.permisosUser
            }
        }
    }
</script>

<style scoped>

</style>
