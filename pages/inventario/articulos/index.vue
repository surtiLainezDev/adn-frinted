<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><nav-inventario/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Inventario"/>
                <div class="row">
                    <div class="col-auto">
                        <b-button :disabled="isPeticon" id="filtroInventario" variant="outline-primary">
                            <b-spinner v-if="isPeticon" small></b-spinner>
                            Filtro</b-button>
                        <b-button v-if="primeraPeticion == 2"  id="filtroProveedores" variant="outline-primary">Proveedores</b-button>
                        <b-button v-if="primeraPeticion == 3"  id="filtroMarcas" variant="outline-primary">Marcas</b-button>
                        <b-button v-if="primeraPeticion == 4"  id="filtroFamilia" variant="outline-primary">Familías</b-button>
                        <b-button v-if="segundaPeticion || primeraPeticion == 1"
                                  @click="consultarInventario" variant="primary">Solicitar Información</b-button>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <vs-table :data="Inventario"  stripe search max-items="10" pagination>
                    <template slot="header">
                        <h6>Articulos</h6>
                    </template>
                    <template slot="thead">
                        <th>Proveedor</th>
                        <th>Marca</th>
                        <th>Módelo</th>
                        <th>Código Sístema</th>
                        <th>Nombre del artículo</th>
                        <th>Código Proveedor</th>
                        <th>Sub-familia</th>
                        <th class="text-center">Acciones</th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr style="font-size: 12px" :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].proveedor">{{data[indextr].proveedor}}</vs-td>
                            <vs-td :data="data[indextr].marca">{{data[indextr].marca}}</vs-td>
                            <vs-td :data="data[indextr].modelo">{{data[indextr].modelo}}</vs-td>
                            <vs-td :data="data[indextr].codigo_sistema">{{data[indextr].codigo_sistema}}</vs-td>
                            <vs-td :data="data[indextr].nombre_articulo">{{data[indextr].nombre_articulo}}</vs-td>
                            <vs-td :data="data[indextr].codigo_proveedor">{{data[indextr].codigo_proveedor}}</vs-td>
                            <vs-td :data="data[indextr].fam">{{data[indextr].fam}}</vs-td>
<!--                            <vs-td class="d-flex justify-content-center">-->
<!--                                <vs-button color="warning" size="small" @click="redirectAlterar(data[indextr].articulo)" style="margin: 1px" icon="create"></vs-button>-->
<!--                            </vs-td>-->
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>

        <b-tooltip target="filtroInventario">
            <div class="row"><div class="col">
                <h6 class="text-center"><strong>Realizar busqueda por:</strong></h6>
            </div></div>
            <div class="row" v-for="item in tooltipInventario" @click="filtrador">
                <div class="col d-flex justify-content-start">
                    <vs-radio v-model="primeraPeticion" :vs-value="item.val">{{item.titulo}}</vs-radio>
                </div></div>
        </b-tooltip>

        <b-tooltip v-for="item in infoTooltip" variant="light"
                   v-if="primeraPeticion == item.item" :target="item.target">
            <div class="tooltip-inner">
                <div class="row"><div class="col">
                    <h6 class="text-center"><strong>{{item.titulo}}</strong></h6>
                </div></div>

                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <b-form-input v-model="buscador" size="sm" :placeholder="item.placeholder"
                                      @keyup="buscarProveedor(item.objeto)"></b-form-input>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row" v-for="index in buscadorAfectado">
                    <div class="col  d-flex justify-content-start">
                        <vs-radio v-model="segundaPeticion" :vs-value="index.id">{{index.nombre}}</vs-radio>
                    </div>
                </div>
            </div>
        </b-tooltip>
    </vs-card>
</template>

<script>
    import tituloh5 from "../../../components/tituloh5";
    import navInventario from "../../../components/navInventario";
    export default {
        components:{navInventario, tituloh5},
        name: "alterar",
        computed:{
            infoTooltip(){
                let info = [
                    {target: 'filtroProveedores', item:2, titulo:'Proveedores',placeholder:'Buscar Proveedor',objeto: this.Proveedores},
                    {target: 'filtroMarcas', item:3, titulo:'Marcas',placeholder:'Buscar Marca',objeto: this.Marcas},
                    {target: 'filtroFamilia', item:4, titulo:'Familias',placeholder:'Buscar Familia',objeto: this.Familias},
                ]
                return info;
            }
        },
        data(){
            return{
                Inventario:[],
                tooltipInventario:[
                    {titulo:'Traer todo el inventario', val:1},
                    {titulo:'Proveedor', val:2},
                    {titulo:'Marca', val:3},
                    {titulo:'Familia', val:4},
                ],
                primeraPeticion: null,
                segundaPeticion: null,
                isPeticon: false,
                Proveedores: null,
                Marcas: [],
                buscador: '',
                buscadorProveedor: [],
                buscadorAfectado: null,
                Familias: null,
            }
        },
        created() {
            this.isPeticon = true
            this.cargarProveedor()
            this.cargarFamilias()
        },
        methods:{
            redirectAlterar(articulo){
                this.$router.replace('/inventario/articulos/entradas/'+articulo)
            },
            consultarInventario(){
                let val
                if(this.primeraPeticion == 1){
                    val = 1
                }else{
                    val = this.segundaPeticion
                }
                this.$axios.get('consultar_articulo/'+this.primeraPeticion+'/'+val).then((res)=>{
                    if (res.status === 200){
                        this.Inventario = res.data.inventario
                    }
                })
            },
            filtrador(){
                this.Inventario = []
                this.segundaPeticion = null
                this.buscador = ''
                if (this.primeraPeticion == 2){
                    this.buscadorAfectado = this.Proveedores
                }else if (this.primeraPeticion == 3){
                    this.buscadorAfectado = this.Marcas
                }else if (this.primeraPeticion == 4){
                    this.buscadorAfectado = this.Familias
                }
            },
            buscarProveedor(item){
                let palabraObjeto
                let palabraInput = this.buscador
                let tamPalabra = palabraInput.length
                if(tamPalabra > 0){
                    this.buscadorAfectado = []
                    for (let i in item){
                        palabraObjeto = item[i].nombre
                        let str = palabraObjeto.substring(0, tamPalabra);
                        if (palabraInput.length <= palabraObjeto.length &&
                            palabraInput.length != 0 && palabraObjeto.length != 0){
                            if (palabraInput.toLowerCase() == str.toLowerCase()){
                                this.buscadorAfectado.push({
                                    "id": item[i].id,
                                    "nombre": item[i].nombre
                                })
                            }
                        }
                    }
                }else{
                    this.buscadorAfectado = item
                }
            },
            cargarProveedor(){
                this.isPeticon = true
                this.$axios.get('proveedores',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status == 200){
                        this.Proveedores = res.data.proveedores
                        this.buscadorProveedor = res.data.proveedores
                        this.cargarMarcasP()
                    }
                })
            },
            cargarMarcasP(){
                for (let i in this.Proveedores){
                    for (let e in this.Proveedores[i].marcas){
                        this.Marcas.push({
                            "proveedor_id" : this.Proveedores[i].id,
                            "nombre": this.Proveedores[i].marcas[e].nombre,
                            "id": this.Proveedores[i].marcas[e].id,
                            "estado": true
                        })
                    }
                }
            },
            cargarFamilias(){
                this.$axios.get('familias',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Familias = res.data.familias
                        this.isPeticon = false
                    }
                })
            }
        }
    }
</script>

<style scoped lang="stylus">
    .tooltip-inner
        max-width: 300px !important;
        width 300px !important
        height 300px
        overflow-y auto
</style>
