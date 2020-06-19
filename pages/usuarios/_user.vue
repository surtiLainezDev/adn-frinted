<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2">
                <side-small/>
            </div>
            <div class="col-md-10">
                <div v-if="$fetchState.pending">
                    <vs-progress indeterminate color="success"></vs-progress>
                </div>
                <div v-else>
                    <vs-progress v-if="isPeticion" indeterminate color="success"></vs-progress>
                    <errores-servidor v-if="erroresServidor" :errores="erroresServidor"/>
                    <div class="row">
                        <div class="col-auto"><h4>{{User.usuario}}</h4></div>
                        <div class="col d-flex justify-content-end">
                            <label for="">Estado del Usuario</label>
                            <vs-switch color="success" @click="cambiarEstado" :disabled="isPeticion" v-model="estado"/>
                        </div>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="row top">
                        <div class="col-auto" v-for="(i, index, item) in infoUser">
                            <radiusficha :texto="infoUser[index]" :tipo="index"
                                         :icono="iconos[item]" color="#30B26e"/>
                        </div>
                    </div>
                    <vs-divider></vs-divider>

                    <div class="row top">
                        <div class="col-lg-5">
                            <div class="row">
                                <div class="col-md-12">
                                    <vs-card class="contenedorPermisos">
                                        <vs-table max-items="4" pagination search @selected="anadirPermisos"
                                                  :data="modulos" v-model="permisoTable">
                                            <template slot="header">
                                                <h5>
                                                    Permisos del usuario
                                                </h5>
                                                <vs-button v-if="isPermisos === false" @click="estadoPermisos" radius color="danger" type="flat" icon="lock"></vs-button>
                                                <vs-button v-if="isPermisos" radius @click="estadoPermisos" color="warning" type="flat" icon="lock_open"></vs-button>
                                                <vs-button v-if="isPermisos" @click="guardarPermisos" radius color="success" type="flat" icon="send"></vs-button>
                                            </template>
                                            <template slot="thead">
                                                <vs-th>Módulo</vs-th>
                                                <vs-th>Usuario</vs-th>
                                                <vs-th>Estado</vs-th>
                                            </template>

                                            <template slot-scope="{data}">
                                                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data" >
                                                    <vs-td :data="data[indextr].nombre">
                                                        {{data[indextr].nombre}}
                                                    </vs-td>

                                                    <vs-td :data="User.usuarios">
                                                        {{User.usuario}}
                                                    </vs-td>

                                                    <vs-td :data="data[indextr].estado">
                                                        <vs-checkbox :disabled="!isPermisos" :vs-value="data[indextr]"
                                                                     v-model="data[indextr].estado"></vs-checkbox>
                                                    </vs-td>
                                                </vs-tr>
                                            </template>
                                        </vs-table>
                                    </vs-card>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <vs-card class="contenedorPermisos">
                                        <vs-table :data="User.inicios_sesion" search max-items="4" pagination>
                                            <template slot="header">
                                                <h5>Inicios de Sesión</h5>
                                            </template>
                                            <template slot="thead">
                                                <vs-th>Usuario</vs-th>
                                                <vs-th>Fecha y Hora</vs-th>
                                                <vs-th>IP</vs-th>
                                            </template>
                                            <template slot-scope="{data}">
                                                <vs-tr :key="indextr" :data="tr" v-for="(tr, indextr) in data" >
                                                    <vs-td >{{User.usuario}}</vs-td>
                                                    <vs-td >{{User.inicios_sesion[indextr].created_at}}</vs-td>
                                                    <vs-td> A espera</vs-td>
                                                </vs-tr>
                                            </template>
                                        </vs-table>
                                    </vs-card>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-7">
                            <div class="row">
                                <div class="col-md-12">
                                    <vs-card>
                                        <vs-list>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <vs-list-header icon="perm_identity" title="Datos Personales"></vs-list-header>
                                                    <vs-list-item icon="face" title="Nombre Completo"
                                                                  :subtitle="User.colaborador.nombres+' '+User.colaborador.apellidos">
                                                        <vs-button size="small" color="warning" @click="redirecCol">Visitar</vs-button>
                                                    </vs-list-item>
                                                    <vs-list-item icon="fingerprint" title="Identidad"
                                                                  :subtitle="User.colaborador.identidad"></vs-list-item>
                                                    <vs-list-item icon="mail_outline" title="Correo Personal"
                                                                  :subtitle="User.colaborador.email"></vs-list-item>
                                                    <vs-list-item icon="phone" title="Telefono"
                                                                  :subtitle="User.colaborador.telefono"></vs-list-item>
                                                </div>
                                                <div class="col-md-6">
                                                    <vs-list-header icon="work" title="Datos del Trabajo" color="success"></vs-list-header>
                                                    <vs-list-item icon="location_on" title="Sucursal asignada"
                                                                  :subtitle="User.colaborador.sucursal.nombre"></vs-list-item>
                                                    <vs-list-item icon="work_outline" title="Puesto"
                                                                  :subtitle="User.colaborador.puesto_colaborador.nombre"></vs-list-item>
                                                </div>
                                            </div>
                                        </vs-list>
                                    </vs-card>
                                </div>
                            </div>
                        </div>
                    </div>

                    <vs-prompt :active.sync="activePrompt"
                               title="Registro Exitoso"
                               color="success"
                               button-cancel
                               @accept="$fetch"
                               accept-text = "Aceptar"
                               @close="$fetch">
                        <p>{{mensaje}}</p>
                    </vs-prompt>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideSmall from "../../components/menus/sideSmall";
    import radiusficha from "../../components/radiusficha";
    import ErroresServidor from "../../components/ErroresServidor";
    export default {
        components:{
            sideSmall,
            radiusficha,
            ErroresServidor
        },
        data(){
            return{
                isPermisos:false,
                permisoTable:[],
                addPermisos: [],
                modulos:         null,
                activePrompt:    false,
                mensaje:         null,
                isPeticion:      false,
                estado:          null,
                User:            null,
                isPeticion:      false,
                infoUser:{
                  correo: null,
                  estado: null,
                  numero_accesso:null,
                  tipo_usuario: null
                },
                iconos:          ['mail_outline','perm_identity','vpn_key','perm_identity'],
                erroresServidor: [],
            }
        },
        methods:{
            estadoPermisos(){
                this.isPermisos = !this.isPermisos
                this.addPermisos = []
            },
            anadirPermisos(){
                if (this.isPermisos){
                    this.permisoTable.estado = !this.permisoTable.estado
                    let existe = false
                    for(let item in this.addPermisos){
                        if (this.addPermisos[item].id === this.permisoTable.id){
                            existe = true
                            this.addPermisos.splice(item, 1)
                            break
                        }
                    }
                    if (!existe){
                        this.addPermisos.push(this.permisoTable)
                    }
                }
            },
            guardarPermisos(){
              this.isPeticion = true
                this.isPermisos = false
              this.$axios.post('save_permisos',{permisos: this.addPermisos},{
                  headers: {
                      'Authorization': 'Bearer ' + this.$store.state.token
                  }
              }).then((res)=>{
                  this.isPeticion = false
                  if (res.status === 200){
                      this.notificacion(
                          'Se registraron cambios',
                          'Se cambiaron los datos exitosamente.',
                          'success'
                      )
                  }
              }).catch((error)=>{
                  if (error.response.data === 422){
                      this.notificacion(
                          'No se registraron cambios',
                          'No se alteró ningún permiso de este usuario.',
                          'warning'
                      )
                  }
              })
            },
            notificacion(titulo, text, color){
              this.$vs.notify({
                  title: titulo,
                  text: text,
                  color: color,
                  position: 'top-right'
              })
            },
            redirecCol(){
              this.$router.replace({path:'/colaborador/'+this.User.colaborador.id})
            },
            cambiarEstado: function(){
                this.erroresServidor = []
              this.estado = !this.estado
                this.isPeticion = true
                this.$axios.post('/cambiar_estado_user',{
                    id:     this.User.colaborador.id,
                    estado: this.estado,
                    user:   this.User.id
                },{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    this.isPeticion = false
                    if (res.status ===200){
                        this.mensaje = `El estado del usuario ${this.User.usuario} ha sido cambiado exitosamente.
                    Para actualizar el dato presione "Aceptar".`
                        this.activePrompt = true
                    }
                }).catch((error)=>{
                    this.isPeticion = false
                    this.erroresServidor.push(error.response.data.error[0])
                    this.estado = this.User.estado
                })
            },
          informacionUser(){
              let estado;
              let userEstado;
              this.infoUser.correo         = this.User.email;
              if (this.User.estado === 1){
                  estado = 'Activo';
                  userEstado = true
              }else if (this.User.estado === 0){
                  estado = 'Inactivo';
                  userEstado = false
              }
              this.infoUser.estado         = estado
              this.infoUser.numero_accesso = this.User.num_ingreso
              this.infoUser.tipo_usuario = this.User.tipo_usuario.nombre
              this.estado = userEstado
          }
        },
        async fetch (){
            this.isPeticion = true
            this.activePrompt = false,
            this.User =(await this.$axios.get('/usuarios/'+this.$route.params.user, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.state.token
                }
            })).data
            this.modulos = this.User.sub
            this.User = this.User.user
            this.isPeticion = false
            this.informacionUser()
        }
    }
</script>

<style scoped lang="stylus">
.top
    margin-top 10px
.contenedorPermisos
    height 350px
</style>
