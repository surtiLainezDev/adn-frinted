<template>
	<div class="container-fluid">
		<div class="d-flex justify-content-center">
			<div class="row" style="width: 60%">
				<div class="col">
					<br>
					<vs-card>
						<div slot="header"><strong>Iniciar Sesión</strong></div>

						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label>Usuario</label>
									<input v-model="login.usuario" type="text" class="form-control form-control-sm">
								</div>
								<div class="form-group">
									<label>Contraseña</label>
									<input v-model="login.password" type="password" class="form-control form-control-sm">
								</div>
								<div class="form-group">
									<label>Código de Usuario</label>
									<input v-model="login.codigo" :disabled="true" type="password" class="form-control form-control-sm">
								</div>
								<div class="form-group d-flex justify-content-end">
									<vs-button color="primary" :disabled="isPeticion"
											   @click="logear" type="filled">Iniciar Sesión</vs-button>
								</div>
								<div class="form-group">
									<nuxt-link to="/recuperacion">¿Se te olvidó tu contraseña?</nuxt-link>
								</div>
							</div>
							<div class="col-md-6 d-flex justify-content-center">
								<div class="align-self-center " style="color: #668EA9" >
									<h1 class="text-center"><strong>ADN</strong></h1>
									<p class="text-center">Administración de Negocios</p>
									<vs-divider></vs-divider>
									<h4 class="text-center">Surtidora Laínez</h4>
									<p class="text-center">surtilainez.it@gmail.com</p>
								</div>
							</div>
						</div>

						<div class="row" v-if="erroresServidor">
							<div class="col">
								<errores-servidor :errores="erroresServidor" />
							</div>
						</div>
						<div class="row" v-if="isPeticion">
							<div class="col">
								<vs-progress indeterminate color="success"></vs-progress>
							</div>
						</div>
					</vs-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import pdf from 'vue-pdf'
	import qs from 'qs';
	import ErroresServidor from "../components/ErroresServidor";
	export default {
		components: {ErroresServidor,pdf},
		data(){
			return{
				login:{
					usuario: null,
					password: null,
					codigo: null
				},
				erroresServidor: [],
				isPeticion: false
			}
		},
		methods:{
			logear(){
				this.isPeticion = true
				this.erroresServidor = []
				return this.$axios({
					method: 'post',
					url: '/login',
					data: qs.stringify({
						email: this.login.usuario,
						password: this.login.password,
						codigo: this.login.codigo
					}),
					headers: {
						'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
						'X-Requested-With': 'XMLHttpRequest'
					}
				}).then(res => {
					this.isPeticion = false
					if (res.data.success){
						let permisos = []
						//guardando token, usuario, tipoUsuario, sucursal globalmente en la app
						localStorage.setItem('token', res.data.success.token);
						localStorage.setItem('usuario', res.data.user.usuario);
						localStorage.setItem('tipoUsuario', res.data.user.tipo_usuario_id);
						localStorage.setItem('sucursal', res.data.user.colaborador.sucursal.nombre);
						localStorage.setItem('estadoUsuario', res.data.user.estado);
						localStorage.setItem('colaborador', res.data.user.colaborador.nombres+' '+res.data.user.colaborador.apellidos)
						for (let item in res.data.permisos){
							if (!permisos.includes(res.data.permisos[item].mod)){
								permisos.push(res.data.permisos[item].mod)
							}
						}
						for (let item in res.data.permisos){
							permisos.push(res.data.permisos[item].num)
						}
						localStorage.setItem('permisosUser', permisos);
						//guardando las variables globales en estados de vue
						this.$store.commit("guardarToken", localStorage.getItem('token'));
						this.$store.commit("guardarUsuario", localStorage.getItem('usuario'));
						this.$store.commit("guardarTipoUsuario", localStorage.getItem('tipoUsuario'));
						this.$store.commit("guardarSucursal", localStorage.getItem('sucursal'));
						this.$store.commit("guardarEstadoUsuario", localStorage.getItem('estadoUsuario'));
						this.$store.commit("guardarPermisos", localStorage.getItem('permisosUser'));
						this.$store.commit("guardarColaborador", localStorage.getItem('colaborador'));
						// redireccionando a la pagina de inicio del sistema
						this.$router.replace({path:"/inicio"})
						// console.log(this.$store.state.permisosUser)
					}
				}).catch((error)=>{
					this.isPeticion = false
					if (error.response.status === 401){
						console.log(error.response)
						this.erroresServidor.push(error.response.data)
					}if (error.response.status === 422){
						console.log(error.response)
						this.erroresServidor.push(error.response.data)
					}
				})
			}
		},

	}
</script>

<style scoped>

</style>
