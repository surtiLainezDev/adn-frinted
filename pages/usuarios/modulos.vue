<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-md-2"><h5>Módulos</h5></div>
                    <div class="col-md-8">
                        <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                    </div>
                    <div class="col-md-2 d-flex justify-content-end">
                        <vs-button radius color="success" type="flat" icon="add" @click="popupActivo = true"></vs-button>
                    </div>
                </div>
                <vs-divider></vs-divider>
                <div class="row">
                    <div class="col">
                        <vs-collapse>
                            <vs-collapse-item v-for="item in  Modulos">
                                <div slot="header">
                                    {{item.num}}. {{item.nombre}}
                                </div>
                                <vs-list>
                                    <vs-list-item>
                                        <vs-button color="success" type="flat"
                                                   @click="popupSubModulo(item.id, item.nombre, item.num)">
                                            Añadir sub-módulo a {{item.nombre}}</vs-button>
                                    </vs-list-item>
                                    <vs-list-item v-for="index in sub" v-if="index.modulo_id === item.id"
                                                  :title="index.num+'.'" :subtitle="index.nombre"></vs-list-item>
                                </vs-list>
                            </vs-collapse-item>
                        </vs-collapse>
                    </div>
                </div>

            </div>
        </div>

        <vs-popup title="Creación de Módulos" :active.sync="popupActivo">
           <div style="padding: 5px">
               <div class="row">
                   <div class="col form-group">
                       <label>Nombre del Módulo</label>
                       <input type="text" class="form-control form-control-sm" v-model="nombreModulo">
                       <div class="error" v-if="errorModulo">
                           Este campo es requerido
                       </div>
                   </div>
               </div>
               <div class="row">
                   <div class="col d-flex justify-content-end">
                       <vs-button color="success"  @click="registrarModulo" type="filled">Registrar Módulo</vs-button>
                   </div>
               </div>
           </div>
        </vs-popup>

        <vs-popup :title="'Crear sub-módulos a '+sub.modulo " :active.sync="popupSub">
            <div style="padding: 5px">
                <div class="row form-group">
                    <label >Nombre del sub-módulo</label>
                    <input type="text" class="form-control form-control-sm" v-model="sub.nombre">
                    <div class="error" v-if="errorModulo">
                        Este campo es requerido
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <vs-button color="success"  @click="registrarSub" type="filled">Registrar Sub-módulo</vs-button>
                    </div>
                </div>
            </div>
        </vs-popup>
    </vs-card>
</template>

<script>
    import sideSmall from "../../components/menus/sideSmall";
    export default {
        name: "modulos",
        data(){
            return{
                popupSub:     false,
                sub:          null,
                errorModulo:  false,
                nombreModulo: null,
                popupActivo:  false,
                Modulos:      null,
                isPeticion:   false,
                sub:{
                    id_modulo: null,
                    modulo:    null,
                    nombre:    null,
                    num:       null
                }
            }
        },
        components:{
            sideSmall
        },
        mounted() {
            this.cargarModulos()
        },
        methods:{
            registrarSub: function(){
              if (!this.sub.nombre){
                  this.errorModulo = true
              }else{
                  this.errorModulo = false;
                  this.$axios.post('/save_submodulos',{
                      id:     this.sub.id_modulo,
                      nombre: this.sub.nombre,
                      num:    this.sub.num
                  },{
                      headers: {
                          'Authorization': 'Bearer ' + this.$store.state.token
                      }
                  }).then((res)=>{
                      if (res.status === 200){
                          this.popupSub = false
                          this.notificacion(
                              'Registro Exitoso',
                              `Se registro exitosamente el sub-módulo de ${this.sub.nombre} en el
                               módulo de ${this.sub.modulo}`
                         )
                          this.sub.nombre = null
                          this.cargarModulos();
                      }
                  })
              }
            },
            popupSubModulo: function(id, modulo, num){
                this.sub.id_modulo = id;
                this.sub.modulo = modulo
                this.sub.num = num
                this.popupSub = true
            },
          registrarModulo:function () {
            if (!this.nombreModulo){
                this.errorModulo = true
            }else{
                this.errorModulo = false
                this.$axios.post('/save_modulos',{
                    nombre: this.nombreModulo
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.popupActivo = false
                        this.notificacion(
                            'Registro Exitoso',
                            'Se registro exitosamente el módulo de '+this.nombreModulo
                        )
                        this.nombreModulo = null
                        this.cargarModulos();
                    }
                })
            }
          },
            cargarModulos: function () {
              this.isPeticion = true
                this.$axios.get('/modulos',{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    this.Modulos = res.data.modulos
                    this.sub = res.data.sub
                })
            },
            notificacion: function (titulo, text) {
                this.$vs.notify({
                    title: titulo,
                    text: text,
                    position: 'top-right',
                    color: 'success'
                })
            }
        },
    }
</script>

<style scoped lang="stylus">
.error
    color red
</style>
