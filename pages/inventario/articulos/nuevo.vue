<template>
    <vs-card>
        <div class="row" style="padding: 5px">
            <div class="col-md-2"><nav-inventario/></div>
            <div class="col-md-10">
                <tituloh5 titulo="Creando Nuevo Artículo"/>
                <vs-progress v-if="isPeticon" indeterminate color="success"></vs-progress>
                <div class="row">
                    <div class="col">
                        <div class="row"><div class="col"><strong>Detalles de categoría</strong></div></div>
                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label>Seleccione una familia</label>
                                <select class="form-control-sm form-control" v-model="Articulo.familia">
                                    <option v-for="item in Familias" :value="item.id">{{item.nombre}}</option>
                                </select>
                            </div>
                            <div class="col-md-6 form-group">
                                <label>Seleccione una sub-familia</label>
                                <select class="form-control-sm form-control" @change="agregarCategoria" v-model="Articulo.subfamilia">
                                    <option v-for="item in SubFamilias" v-if="item.familia_id === Articulo.familia"
                                            :value="item.id">{{item.nombre}}</option>
                                </select>
                            </div>
                        </div>
                        <div  class="row"><div class="col"><strong>Detalles del proveedor</strong></div></div>
                        <div class="row">
                            <div class="col-md-4 form-group">
                                <label >Seleccione un proveedor</label>
                                <select v-model="Articulo.proveedor" class="form-control form-control-sm">
                                    <option v-for="item in Proveedores" :value="item.id">{{item.nombre}}</option>
                                </select>
                            </div>
                            <div class="col-md-4 form-group">
                                <label >Seleccione una marca</label>
                                <select v-model="Articulo.marca" @change="agregarNombreMarca" class="form-control form-control-sm">
                                    <option v-for="item in Marcas" v-if="item.proveedor_id === Articulo.proveedor"
                                            :value="item.id">{{item.nombre}}</option>
                                </select>
                            </div>
                            <div class="col-md-4 form-group">
                                <label >Módelo </label>
                                <input type="text" v-model="Articulo.modelo"
                                       max="50" class="form-control-sm form-control">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 form-group">
                                <label>Código del proveedor</label>
                                <input type="text" max="50" class="form-control form-control-sm" v-model="Articulo.codigoProveedor">
                            </div>
                            <div class="col-md-4 form-group">
                                <label>Referencia del fabricante</label>
                                <input type="text" v-model="Articulo.fabricante" max="50" class="form-control-sm form-control">
                            </div>
                            <div class="col-md-4">
                                <label>Código de barras</label>
                                <input type="text" v-model="Articulo.barras" max="13" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row"><div class="col"><strong>Detalles generales</strong></div></div>
                        <div class="row">
                            <div class="col-md-9 form-group">
                                <label>Nombre de artículo</label>
                                <input type="text" max="30" v-model="Articulo.nombre" @change="agregarModelo"
                                       class="form-control-sm form-control">
                                <span class="error" v-if="errorRequired">{{errorRequired}}</span>
                            </div>
                            <div class="col-md-3 form-group">
                                <label>Precio de costo</label>
                                <input type="text" v-model="Articulo.precio" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 form-group">
                                <label>Descripción del artículo</label>
                                <input v-model="Articulo.descripcion" max="100" type="text" class="form-control-sm form-control">
                                <span class="error" v-if="errorRequired">{{errorRequired}}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-9 form-group">
                                <label>Seleccionar foto de ficha</label>
                                <b-form-file
                                        v-model="Articulo.file"
                                        :state="Boolean(Articulo.file)"
                                        placeholder="Buscar foto para el artículo"
                                        accept="image/*"
                                        browse-text="Buscar"
                                ></b-form-file>
                            </div>
                            <div class="col-md-3 form-group d-flex align-items-end">
                                <vs-button v-if="Articulo.file" @click="fileV"
                                           color="success" icon="publish">Agregar Foto</vs-button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 form-group d-flex justify-content-start">
                                <vs-checkbox v-b-tooltip.hover title="Son artículos que traen otro componentes con ellos como patas, casco, bateria etc..."
                                          v-model="Articulo.isCompuesto"
                                          @click="Articulo.isCompuesto = !Articulo.isCompuesto">Artículo compuesto</vs-checkbox>
                            </div>
                            <div class="col-md-4 form-group d-flex justify-content-start">
                                <vs-checkbox v-b-tooltip.hover title="Son artículos que pueden ser una motocicletas, motocargo, mototaxi, cuatrimoto etc..."
                                          v-model="Articulo.isMotocicleta"
                                          @click="Articulo.isMotocicleta = !Articulo.isMotocicleta">El artículo es un vehículo</vs-checkbox>
                            </div>
                            <div class="col-md-4 form-group d-flex justify-content-start">
                                <vs-checkbox v-b-tooltip.hover title="Son los detalles que son públicos."
                                             v-model="Articulo.isDetalles"
                                             @click="Articulo.isDetalles = !Articulo.isDetalles">Agregar detalles técnicos</vs-checkbox>
                            </div>
                        </div>
                        <div v-if="Articulo.isCompuesto">
                            <div class="row"><div class="col"><strong>Agregar datos de los componentes</strong></div></div>
                            <div class="row"><div class="col d-flex justify-content-end">
                                <vs-button @click="addFilaCompuesto" color="success" icon="add"></vs-button>
                            </div></div>
                            <div class="row tituloComponentes">
                                <div class="col-md-2">Cant.</div>
                                <div class="col-md-7">Descripción del datalle</div>
                                <div class="col-md-2">Cant. det.</div>
                                <div class="col-md-1">Quitar</div>
                            </div>
                            <div class="row filas" v-for="(item, index) in Articulo.componentes">
                                <div class="col-md-2 d-flex justify-content-center">
                                    <vs-input-number size="small" v-model="item.cantidad" min="1"></vs-input-number>
                                </div>
                                <div class="col-md-7">
                                    <input type="text" v-model="item.detalle" class="form-control form-control-sm">
                                    <span class="error" v-if="item.required">{{errorRequired}}</span>
                                </div>
                                <div class="col-md-2">
                                    <input  v-b-tooltip.hover title="Este campo es opcional, se usa cuando en cantidad va referido a detalle como un juego. Por ejemplo 1 juego de patas, entonces en este campo va la cantidad de patas que tiene este juego de patas"
                                            type="number" v-model="item.cantidad_detalle" class="form-control form-control-sm">
                                </div>
                                <div class="col-md-1">
                                    <vs-button icon="clear" @click="removeFilaCompuestos(item.fila)"
                                               color="danger" size="small"></vs-button>
                                </div>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div v-if="Articulo.isDetalles">
                            <div class="row"><div class="col"><strong>Agregar detalles técnicos</strong></div></div>
                            <div class="row"><div class="col d-flex justify-content-end">
                                <vs-button @click="addFilaDetalles" color="success" icon="add"></vs-button>
                            </div></div>
                            <div class="row">
                                <div class="col-md-10">Detalles</div>
                                <div class="col-md-1">Quitar</div>
                                <div class="col-md-1"></div>
                            </div>
                            <div class="row filas" v-for="(item, index) in Articulo.detalles">
                                <div class="col-md-10">
                                    <input type="text" v-model="item.detalle" class="form-control form-control-sm">
                                    <span class="error" v-if="item.required">{{errorRequired}}</span>
                                </div>
                                <div class="col-md-1">
                                    <vs-button icon="clear" @click="removeFilaDetalles(item.fila)"
                                               color="danger" size="small"></vs-button>
                                </div>
                                <div class="col-md-1"></div>
                            </div>
                        </div>
                        <vs-divider></vs-divider>

                    </div>
                    <div class="col">
                        <div class="row">
                            <div class="col d-flex justify-content-start">
                                <vs-button :disabled="isPeticon" @click="sideFamilia = true" color="success">Crear Familia</vs-button>
                            </div>
                            <div class="col d-flex justify-content-center">
                                <vs-button :disabled="isPeticon" @click="sideSubFamilia = true" color="success">Crear Sub-familia</vs-button>
                            </div>
                            <div class="col d-flex justify-content-end">
                                <vs-button :disabled="isPeticon" @click="registrarArticulo" color="success">Registrar Artículo</vs-button>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <vs-card>
                            <div slot="header">
                                <div class="row">
                                    <div class="col-auto d-flex align-items-center">
                                        <h6 v-if="Articulo.nombre">{{Articulo.nombre}}</h6>
                                        <h6 v-else>Ficha de Articulo</h6>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-2">
                                    <vs-avatar v-if="Articulo.filePath" :src="Articulo.filePath"  size="100px" icon="not_interested"/>
                                    <vs-avatar v-else  size="100px" icon="not_interested"/>
                                </div>
                                <div class="col-md-1"></div>
                                <div class="col-md-9">
                                    <div class="row"><div class="col">
                                        <strong>Marca:</strong> {{Articulo.nombreMarca}}
                                    </div></div>
                                    <div class="row"><div class="col">
                                        <strong>Módelo:</strong> {{Articulo.modelo}}
                                    </div></div>
                                    <div class="row"><div class="col">
                                        <strong>Categoría:</strong> {{Articulo.nombreSubFamilia}}
                                    </div></div>
                                    <div class="row"><div class="col">
                                        <strong>Descripción:</strong> {{Articulo.descripcion}}
                                    </div></div>
                                    <div v-if="Articulo.isCompuesto">
                                        <vs-divider></vs-divider>
                                        <div class="row"><div class="col"><strong>Componentes del artículo</strong></div></div>
                                        <div class="row" v-for="(item, indice) in Articulo.componentes">
                                            <div class="col">{{indice + 1}}. - {{item.cantidad}} {{item.detalle}}</div></div>
                                    </div>
                                    <div v-if="Articulo.isDetalles">
                                        <vs-divider></vs-divider>
                                        <div class="row"><div class="col"><strong>Detalles técnicos del artículo</strong></div></div>
                                        <div class="row" v-for="(item, indice) in Articulo.detalles">
                                            <div class="col">{{indice + 1}}. - {{item.detalle}}</div></div>
                                    </div>
                                    <vs-divider></vs-divider>
                                </div>
                            </div>
                        </vs-card>
                    </div>
                </div>

            </div>
        </div>


        <b-sidebar v-model="sideFamilia" title="Creando Familia" right shadow width="450px">
            <div class="px-3 py-2">
                <vs-progress v-if="isPeticionSave" color="success" indeterminate></vs-progress>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la familia</label>
                        <input type="text" class="form-control form-control-sm" v-model="Familia.nombre">
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button :disabled="isPeticionSave" @click="registrarFamilia" v-if="Familia.nombre"
                                   color="success">Registrar Familia</vs-button>
                    </div>
                </div>
            </div>
        </b-sidebar>
        <b-sidebar v-model="sideSubFamilia" title="Creando Sub-familia" right shadow width="450px">
            <div class="px-3 py-2">
                <vs-progress v-if="isPeticionSave" color="success" indeterminate></vs-progress>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la familia</label>
                        <select v-model="SubFamilia.familia" class="form-control-sm form-control">
                            <option v-for="item in Familias" :value="item.id">{{item.nombre}}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col form-group">
                        <label>Nombre de la sub-familia</label>
                        <input type="text"  class="form-control form-control-sm" v-model="SubFamilia.nombre">
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button @click="registrarSubFamilia" v-if="SubFamilia.nombre && SubFamilia.familia"
                                   :disabled="isPeticionSave" color="success">Registrar Sub-Familia</vs-button>
                    </div>
                </div>
            </div>
        </b-sidebar>
    </vs-card>

</template>

<script>
    import navInventario from "../../../components/navInventario";
    import tituloh5 from "../../../components/tituloh5";
    import {maxLength, minLength, required} from "vuelidate/lib/validators";
    export default {
        components:{
            tituloh5,
            navInventario,
        },
        data(){
            return{
                SubFamilia:{
                    nombre: '',
                    familia: null,
                    sub: ''
                },
                Familia:{
                    nombre: '',
                    codigo: '',
                    familia: null
                },
                sideSubFamilia: false,
                sideFamilia: false,
                errores:{
                    required: 'Este campo es requerido.',
                    min: 'Este campo lo mínimo de carácteres que acepta son ',
                    max: 'Este campo lo máximo de carácteres que acepta son ',
                    email: 'Este campo tiene que ser un correo valido.',
                    numeric: 'Este campo solo acepta datos númericos.'
                },
                erroresServidor:{},
                Proveedores: null,
                errorRequired: 'Este campo no puede quedar vacio',
                Marcas:[],
                Modelos:[],
                Familias:null,
                SubFamilias: [],
                isPeticon: false,
                Articulo:{
                    nombre:null,
                    descripcion: null,
                    proveedor: null,
                    marca: null,
                    nombreMarca: null,
                    modelo: null,
                    barras: null,
                    precio: null,
                    codigoProveedor: null,
                    fabricante: null,
                    nombreModelo: null,
                    familia: null,
                    subfamilia: null,
                    nombreSubFamilia: null,
                    isCompuesto: false,
                    isMotocicleta: false,
                    componentes:[],
                    detalles:[],
                    isDetalles:false,
                    file: null,
                    filePath: null
                },
                isPeticionPrincipal: false,
                isPeticionSave: false
            }
        },
        // validations:{
        //     Articulo: {
        //         nombre:  {required, min:minLength(3), max:maxLength(30)},
        //         descripcion:   {required, min:minLength(3), max:maxLength(100)},
        //         marca: {required},
        //         modelo: {required, max:maxLength(50)},
        //         subfamilia: {required},
        //     }
        // },
        created() {
            this.cargarProveedor();
            this.cargarFamilias();
        },
        methods:{
            registrarSubFamilia(){
                this.isPeticionSave = true
                this.$axios.post('sub_familias',{
                    familia: this.SubFamilia.familia,
                    nombre: this.SubFamilia.nombre
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.cargarFamilias()
                        this.isPeticionSave = false
                        this.sideSubFamilia = false
                        this.$vs.notify({
                            color:'success',
                            text: 'Se ha regsitrado la sub-familia correctamento en la base de datos.',
                            title: 'Registro Exitoso',
                            position: 'top-right'
                        })
                        this.SubFamilia.nombre = ''
                        this.SubFamilia.familia = null
                    }
                })
            },
            registrarFamilia(){
                this.isPeticionSave = true
                this.$axios.post('familias',{
                    nombre: this.Familia.nombre,
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.isPeticionSave = false
                        this.sideFamilia = false
                        this.Familia.nombre = ''
                        this.cargarFamilias()
                        this.$vs.notify({
                            text:'Se guardo la familia correctamente en la base de datos.',
                            title: 'Registro Exitoso',
                            color:'success',
                            position: 'top-right'
                        })
                    }
                })
            },
            fileV(){
                this.Articulo.filePath = this.Articulo.file.path
            },
            registrarArticulo(){
                let componentes = this.Articulo.componentes.length
                let longitudComponentes = 0;
                let longitudDetalles = 0;
                let detalles = this.Articulo.detalles.length
                for (let i in this.Articulo.componentes){
                    if (this.Articulo.componentes[i].detalle){
                        this.Articulo.componentes[i].required = false
                        longitudComponentes++;
                    }else{
                        this.Articulo.componentes[i].required = true
                    }
                }
                for (let i in this.Articulo.detalles){
                    if (this.Articulo.detalles[i].detalle){
                        this.Articulo.detalles[i].required = false
                        longitudDetalles++
                    }else{
                        this.Articulo.detalles[i].required = true
                    }
                }
                if (componentes === longitudComponentes && longitudDetalles === detalles && this.Articulo.nombre){
                    let data = new FormData();
                    this.isPeticon = true
                    if (this.Articulo.componentes.length < 1){
                        this.Articulo.isCompuesto = false
                    }
                    if (this.Articulo.detalles.length < 1){
                        this.Articulo.isDetalles = false
                    }
                    let detalles = JSON.stringify(this.Articulo.detalles)
                    let compuestos = JSON.stringify(this.Articulo.componentes)
                    data.append('modelo',              this.Articulo.modelo);
                    data.append('marca',               this.Articulo.marca);
                    data.append('ferencia_fabricante', this.Articulo.fabricante);
                    data.append('codigo_barras',       this.Articulo.barras);
                    data.append('codigo_proveedor',    this.Articulo.codigoProveedor);
                    data.append('nombre',              this.Articulo.nombre);
                    data.append('descripcion',         this.Articulo.descripcion);
                    data.append('subfamilia',          this.Articulo.subfamilia);
                    data.append('isDetalles',          this.Articulo.isDetalles);
                    data.append('isCompuesto',         this.Articulo.isCompuesto);
                    data.append('isMotocicleta',       this.Articulo.isMotocicleta);
                    data.append('Compuesto',           compuestos);
                    data.append('detalles',            detalles);
                    data.append('precio',              this.Articulo.precio);
                    data.append('Foto',                this.Articulo.file);
                    this.$axios({
                        method: 'post',
                        url:    'articulos',
                        data:   data,
                        headers:{
                            'Authorization': 'Bearer ' + this.$store.state.token,
                            'Content-Type': "multipart/form-data"
                        }
                    }).then((res)=>{
                        if (res.status === 200){
                            this.isPeticon = false
                            this.$router.replace({path:'/inventario/'})
                            this.$vs.notify({
                                color:'success',
                                title:'Registro de Artículo exitoso',
                                text:'El artículo se registró exitosamente en la base de datos',
                                position: 'top-right'
                            })
                        }
                    })
                }
            },
            agregarCategoria(){
                for (let i in this.SubFamilias){
                    if (this.SubFamilias[i].id === this.Articulo.subfamilia){
                        this.Articulo.nombreSubFamilia = this.SubFamilias[i].nombre
                    }
                }
            },
            agregarNombreMarca(){
                for (let i in this.Marcas){
                    if (this.Marcas[i].id === this.Articulo.marca){
                        this.Articulo.nombreMarca = this.Marcas[i].nombre
                    }
                }
            },
            agregarModelo(){
              this.Articulo.descripcion = this.Articulo.nombre
            },
            addFilaDetalles(){
                let fila = this.Articulo.detalles.length
                this.Articulo.detalles.push({
                    "fila": fila,
                    "detalle": '',
                    "required": false
                })
            },
            removeFilaDetalles(fila){
                this.Articulo.detalles.splice(fila, 1)
                for (let item in this.Articulo.detalles){
                    this.Articulo.detalles[item].fila = item
                }
            },
            addFilaCompuesto(){
                let fila = this.Articulo.componentes.length
                    this.Articulo.componentes.push({
                    "fila": fila ,
                    "cantidad": 1,
                    "detalle": '',
                    "cantidad_detalle": null,
                    "required": false
                })
            },
            removeFilaCompuestos(fila){
                this.Articulo.componentes.splice(fila, 1)
                for (let item in this.Articulo.componentes){
                    this.Articulo.componentes[item].fila = item
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
                        this.cargarMarcasP()
                        this.isPeticon = false
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
                        this.cargarSubFamilias()
                    }
                })
            },
            cargarSubFamilias(){
                this.SubFamilias = []
                for (let i in this.Familias){
                    for (let e in this.Familias[i].sub_familia_articulos){
                        this.SubFamilias.push({
                            "familia_id": this.Familias[i].id,
                            "nombre": this.Familias[i].sub_familia_articulos[e].nombre,
                            "id": this.Familias[i].sub_familia_articulos[e].id
                        })
                    }
                }
                this.isPeticionPrincipal = false
            }
        },
        name: "nuevo"
    }
</script>

<style scoped lang="stylus">
.error
    color red
.filas
    margin-top 5px
.tituloComponentes
    font-weight bold
    font-size 12px
    margin-top 10px

</style>
