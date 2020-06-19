<template>
    <vs-card>
        <div class="row">
            <div class="col-md-2"><side-colaboradores/></div>
            <div class="col-md-10">
                <div v-if="Cuenta">
                    <tituloh5 :titulo="Cuenta.descripcion+' en '+Cuenta.banco.nombre"/>
                    <div class="row">
                        <div class="col-auto" v-for="(i, index,item) in infoCuenta">
                            <radiusficha :texto="''+infoCuenta[index]" :tipo="index"
                                         :icono="iconos[item]" color="#30B26e"/>
                        </div>
                        <vs-divider></vs-divider>
                    </div>
                </div>
            </div>
        </div>
    </vs-card>
</template>

<script>
    import sideColaboradores from "../../../../components/menus/sideColaboradores";
    import radiusficha from "../../../../components/radiusficha";
    import tituloh5 from "../../../../components/tituloh5";
    export default {
        name: "_cuenta",
        components:{
            sideColaboradores,tituloh5, radiusficha
        },
        data(){
            return{
                Cuenta: null,
                infoCuenta:{
                    banco: null,
                    tipo_cuenta: null,
                    numero: null,
                    total: null
                },
                iconos: ['account_balance','account_balance','account_balance','monetization_on']
            }
        },
        created() {
            this.cargarCuenta()
        },
        methods:{
            addInfoCuenta(){
                this.infoCuenta.banco  = this.Cuenta.banco.nombre
                this.infoCuenta.tipo_cuenta   = this.Cuenta.tipo_cuenta_banco.nombre
                this.infoCuenta.numero = this.Cuenta.num
                this.infoCuenta.total  = 'L '+this.Cuenta.total
            },
            cargarCuenta(){
                this.$axios.get('/cuenta/'+this.$route.params.cuenta,{
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.state.token
                    }
                }).then((res)=>{
                    if (res.status === 200){
                        this.Cuenta = res.data.cuenta
                        this.addInfoCuenta()
                    }
                })
            }
        },
    }
</script>

<style scoped>

</style>
