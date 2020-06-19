<template>
    <vs-table
            search
            max-items="10" pagination
            :data="datosPlanillas">
        <template slot="header">
            <h4>
                {{titulo}}
            </h4>
        </template>
        <template slot="thead">
            <vs-th v-for="item in theads">{{item}}</vs-th>
        </template>

        <template slot-scope="{data}">
            <!--            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >-->
            <!--                <vs-td>-->
            <!--                    {{data[indextr].codigo}}-->
            <!--                </vs-td>-->
            <!--                <vs-td >-->
            <!--                    {{data[indextr].fecha_creacion}}-->
            <!--                </vs-td>-->
            <!--                <vs-td >-->
            <!--                    L {{data[indextr].total_planilla}}-->
            <!--                </vs-td>-->
            <!--                <vs-td >-->
            <!--                    {{data[indextr].periodo}} de {{data[indextr].mes_asignado}} del {{data[indextr].ano}}-->
            <!--                </vs-td>-->
            <!--                <vs-td >-->
            <!--                    {{data[indextr].nombre}}-->
            <!--                </vs-td>-->
            <!--                <vs-td >-->
            <!--                    {{data[indextr].usuario}}-->
            <!--                </vs-td>-->
            <!--                <vs-td>-->
            <!--                    <vs-chip v-if="data[indextr].estado === 1" color="success">Registrado</vs-chip>-->
            <!--                    <vs-chip v-if="data[indextr].estado === 0" color="danger">Pendiente</vs-chip>-->
            <!--                </vs-td>-->
            <!--                <vs-td class="d-flex justify-content-center">-->
            <!--                    <vs-button v-if="pdf" radius color="warning"  type="flat" icon="get_app"></vs-button>-->
            <!--                    <vs-button radius color="success" @click="redirectPlanilla(data[indextr].id)"  type="flat" icon="visibility"></vs-button>-->
            <!--                </vs-td>-->
            <!--            </vs-tr>-->
        </template>
    </vs-table>
</template>

<script>
    export default {
        name: "tablaCajas",
        props:{
            titulo: String,
            theads: Array,
            datosPlanillas: Array
        }
    }
</script>

<style scoped>

</style>
