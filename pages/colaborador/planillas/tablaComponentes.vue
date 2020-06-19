<template>
    <vs-table
            search
            max-items="5" pagination
            :data="datoPlanillas">
        <template slot="header">
            <h5>
                {{titulo}}
            </h5>
        </template>
        <template slot="thead">
            <vs-th v-for="item in head">{{item}}</vs-th>
        </template>

        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                <vs-td>
                    {{data[indextr].colaborador[0].nombres}} {{data[indextr].colaborador[0].apellidos}}
                </vs-td>
                <vs-td>{{data[indextr].colaborador[0].identidad}}</vs-td>
                <vs-td>{{data[indextr].colaborador[0].nombre}}</vs-td>
                <vs-td>L {{data[indextr].sueldo_base}}</vs-td>
                <vs-td>{{data[indextr].dias_trabajados}} días</vs-td>
                <vs-td>L {{data[indextr].pago}}</vs-td>
                <vs-td>L {{data[indextr].total_agregado}}</vs-td>
                <vs-td>L {{data[indextr].total_deducido}}</vs-td>
                <vs-td>L {{data[indextr].total_pagar}}</vs-td>
            </vs-tr>
            <vs-tr>
                <vs-td colspan="8"><strong>Total</strong></vs-td>
                <vs-td ><strong>{{total}}</strong></vs-td>
            </vs-tr>
        </template>
    </vs-table>
</template>

<script>
    export default {
        name: "tablaComponentes",
        props:{
            titulo:        String,
            head:          Array,
            datoPlanillas: Array,
            total:          String
        },
    }
</script>

<style scoped>

</style>
