<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><nav-inventario/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Creando orden de compra"/>
                <vs-progress v-if="isLoad" indeterminate color="success"></vs-progress>
                <div class="row">
                    <div class="col-md-5 form-group">
                        <label>Seleccionar proveedor</label>
                        <b-form-select v-model="Orden.proveedor" size="sm" @change="cargarInventario">
                            <b-form-select-option v-for="item in Proveedores"
                                                  :value="item.id">{{item.nombre}}</b-form-select-option>
                        </b-form-select>
                    </div>
                    <div class="col-md-4 form-group">
                        <label>Seleccionar Sucursal</label>
                        <b-form-select v-model="Orden.sucursal" size="sm">
                            <b-form-select-option v-for="item in Sucursales"
                                                  :value="item.id">{{item.nombre}}</b-form-select-option>
                        </b-form-select>
                    </div>
                    <div class="col-md-3">
                        <div class="row">
                            <div class="col-auto"><strong>Cantidad de Artículos:</strong></div>
                            <div class="col d-flex justify-content-end">{{totales.cantidad}}</div>
                        </div>
                        <div class="row">
                            <div class="col-auto"><strong>Total:</strong></div>
                            <div class="col d-flex justify-content-end">L {{totales.total}}</div>
                        </div>
                        <div class="row">
                            <div class="col-auto"><strong>Total Impuesto:</strong></div>
                            <div class="col d-flex justify-content-end">L {{totales.impuesto}}</div>
                        </div>
                        <div class="row">
                            <div class="col-auto"><strong>Total de la Orden:</strong></div>
                            <div class="col d-flex justify-content-end">L {{totales.totalF}}</div>
                        </div>
                    </div>
                </div>
                <div class="contendor">
                    <table class="table table-hover table-striped table-sm">
                        <thead>
                        <tr>
                            <th>
                                <vs-button color="success" @click="addFila" size="small" icon="add"></vs-button>
                            </th>
                            <th>Buscar</th>
                            <th>Artículo</th>
                            <th>Cant.</th>
                            <th>Precio Costo</th>
                            <th>Impuesto</th>
                            <th>Precio c/i</th>
                            <th>Total</th>
                            <th>Eliminar</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in Orden.Articulos" >
                            <td width="5%">{{index + 1}}</td>
                            <td width="5%">
                                <b-spinner v-if="isPeticion" variant="success" type="grow"></b-spinner>
                                <vs-button :disabled="isLoad" @click="abrirModal(index)" v-else color="success" size="small" icon="search"></vs-button>
                            </td>
                            <td style="width: 50%">
                                <input type="text" class="form-control form-control-sm" v-model="item.articulo">
                            </td>
                            <td width="5%">
                                <input type="text" @keyup="multiplicarTotalFila(index)"
                                       class="form-control-sm form-control" v-model="item.cantidad">
                            </td>
                            <td width="10%">
                                <input type="text" disabled="true" class="form-control-sm form-control" v-model="item.precio">
                            </td>
                            <td width="5%">
                                <input type="number" @keyup="multiplicarTotalFila(index)"
                                       class="form-control-sm form-control" v-model="item.impuesto">
                            </td>
                            <td width="10%">
                                <input type="text" disabled="true" class="form-control-sm form-control" v-model="item.precio_s">
                            </td>
                            <td width="10%">
                                <input type="text" disabled="true" class="form-control-sm form-control" v-model="item.total">
                            </td>
                            <td width="5%">
                                <vs-button icon="clear" @click="removeFila(index)" color="danger" size="small"></vs-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="row d-flex justify-content-end" style="font-size: 16px">
                    <div class="col-auto"><strong>Cantidad: {{totales.cantidad}}</strong></div>
                    <div class="col-auto"><strong>Sub-total: {{totales.total}} lps</strong></div>
                    <div class="col-auto"><strong>Impuesto: {{totales.impuesto}} lps</strong></div>
                    <div class="col-auto"><strong>Total: {{totales.totalF}} lps</strong></div>
                </div>
            </div>

            <b-modal v-model="modalInventario" size="xl"
                     :title="'Seleccionando artículo para la fila '+(this.modalId + 1)">
                <vs-table :data="Inventario" max-items="10" pagination search>
                    <template slot="header"><h6>Artículos disponibles</h6></template>
                    <template slot="thead">
                        <vs-th>Proveedor</vs-th>
                        <vs-th>Familia</vs-th>
                        <vs-th>Sub-familia</vs-th>
                        <vs-th>Código</vs-th>
                        <vs-th>Artículo</vs-th>
                        <vs-th>Módelo</vs-th>
                        <vs-th>Precio costo</vs-th>
                        <vs-th class="text-center">Seleccionar</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr style="font-size: 12px" :key="indextr" :data="tr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].proveedor">{{data[indextr].proveedor}}</vs-td>
                            <vs-td :data="data[indextr].familia">{{data[indextr].familia}}</vs-td>
                            <vs-td :data="data[indextr].fam">{{data[indextr].fam}}</vs-td>
                            <vs-td :data="data[indextr].codigo_sistema">{{data[indextr].codigo_sistema}}</vs-td>
                            <vs-td :data="data[indextr].nombre_articulo">{{data[indextr].nombre_articulo}}</vs-td>
                            <vs-td :data="data[indextr].modelo">L {{data[indextr].modelo}}</vs-td>
                            <vs-td :data="data[indextr].precio_costo">L {{data[indextr].precio_costo}}</vs-td>
                            <vs-td class="d-flex justify-content-center" >
                                <vs-button icon="forward" @click="registrarFila(tr)"
                                           size="small" color="success"></vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
                <template v-slot:modal-footer="{ ok}">
                    <b-button size="sm" variant="success" @click="ok()">
                        Cerrar
                    </b-button>
                </template>
            </b-modal>
        </div>
    </vs-card>
</template>

<script>
    import navInventario from "../../../components/navInventario";
    import tituloh5 from "../../../components/tituloh5";
    export default {
        data(){
            return{
                Proveedores: null,
                isLoad: false,
                Orden:{
                    proveedor: null,
                    sucursal: null,
                    Articulos: [
                        {fila:0, articulo:'', required:false, cantidad:1, impuesto:15, precio:0, total:0, precio_s:0}
                    ]
                },
                Sucursales: null,
                Inventario: [],
                isPeticion: false,
                modalInventario: false,
                modalId: null,
                totales:{
                    cantidad: 0,
                    total: 0,
                    impuesto: 0,
                    totalF: 0
                }
            }
        },
        components:{navInventario, tituloh5},
        created() {
            this.isLoad = true
            this.cargarProveedor()
            this.cargarSucursales()
        },
        methods:{
            totalOrder(){
                let precios = 0, cantidad = 0
                let impuestos = 0
                let fila = this.Orden.Articulos
                for( let item in fila) {
                    cantidad = (parseInt(cantidad) + parseInt(fila[item].cantidad))
                    precios = parseFloat(precios) + (parseFloat(fila[item].precio) * fila[item].cantidad)
                    impuestos = ((fila[item].impuesto/100).toFixed(2) * precios).toFixed(2)
                }
                this.totales.cantidad = cantidad
                this.totales.total = precios
                this.totales.impuesto = impuestos
                this.totales.totalF = (parseFloat(impuestos) + parseFloat(precios)).toFixed(2)
            },
            registrarFila(tr){
                this.Orden.Articulos[this.modalId].articulo = tr.modelo+' - '+tr.nombre_articulo +' - '+tr.codigo_proveedor
                this.Orden.Articulos[this.modalId].precio = tr.precio_costo
                this.multiplicarTotalFila(this.modalId)
                this.modalInventario = false
            },
            multiplicarTotalFila(fila){
                let impuesto = this.Orden.Articulos[this.modalId].impuesto / 100
                impuesto = impuesto + 1
                let precio = this.Orden.Articulos[fila].precio * impuesto
                this.Orden.Articulos[fila].precio_s = precio.toFixed(2)
                let total = (this.Orden.Articulos[fila].cantidad * precio).toFixed(2)
                this.Orden.Articulos[fila].total = total
                this.totalOrder()
            },
            abrirModal(fila){
                this.modalId = fila
                this.modalInventario = true
            },
            addFila(){
                let fila = this.Orden.Articulos.length
                this.Orden.Articulos.push({
                    "fila": fila ,
                    "articulo": '',
                    "required": false,
                    "cantidad": 1,
                    "impuesto": 15,
                    "precio": 0,
                    "total": 0
                })
            },
            removeFila(fila){
                if (this.Orden.Articulos.length < 2){
                    this.notificacion('warning', 'No se puede elimar la fila porque es la última.',
                        'Error al eliminar fila')
                }else{
                    this.Orden.Articulos.splice(fila, 1)
                    for (let item in this.Orden.Articulos){
                        this.Orden.Articulos[item].fila = item
                    }
                this.totalOrder()
                    this.notificacion('success', 'Ha eliminado una fila.',
                        'Eliminación Exitosa')
                }
            },
            notificacion(color, text, titulo){
                this.$vs.notify({
                    text: text,
                    title: titulo,
                    position: 'top-right',
                    color: color
                })
            },
            cargarProveedor(){
                this.$axios.get('proveedores',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status == 200){
                        this.Proveedores = res.data.proveedores
                    }
                })
            },
            cargarSucursales(){
                this.$axios.get('/sucursales',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Sucursales = res.data.suc
                        this.isLoad = false
                    }
                })
            },
            cargarInventario(){
                this.isPeticion = true
                this.$axios.get('consultar_articulo/2/'+this.Orden.proveedor).then((res)=>{
                    if (res.status === 200){
                        if (this)
                            this.Inventario = res.data.inventario
                            this.isPeticion = false
                    }
                })
            }
        }

    }
</script>

<style scoped lang="stylus">
.contendor
    height 350px
    width 100%
    padding 1px
    margin-top 5px
    overflow-y auto
.contendor .header
    font-size 17px

</style>
