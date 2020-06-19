<template>
    <div class="circulo" @mouseenter="blancoDivider" @mouseleave="normalDivider">
        <div class="row">
            <div class="col d-flex justify-content-center" >
                <span><vs-icon :icon="icono" size="50px" ></vs-icon></span>
            </div>
        </div>
        <vs-divider  :color="colorDivider">{{tipo}}</vs-divider>
        <div class="d-flex justify-content-center">
            <div class="row contenedorContenido">
                <div class="col d-flex justify-content-center">
                    <p class="text-justify">{{texto}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "radiusficha",
        data(){
          return{
              colorDivider: this.color
          }
        },
        props:{
            icono: String,
            identidad: String,
            texto: String,
            tipo: String,
            color: String
        },
        methods:{
            blancoDivider:function () {
                this.colorDivider = '#FFF'
            },
            normalDivider: function () {
                this.colorDivider = this.color
            }
        }
    }
</script>

<style scoped lang="stylus">
    .circulo
        height 180px
        width 180px
        background-color #FFF
        border-radius 200px 200px 200px 200px
        -moz-border-radius 200px 200px 200px 200px
        -webkit-border-radius 200px 200px 200px 200px
        border: 5px solid #30B26E
        margin-top 5px
    .circulo .row .col p
        font-size 12px
        color #30B26E
    .circulo .row .col span
        color #30B26E
    .circulo:hover
        background-color #30B26E
        border 5px solid #FFF
        .row .col span
            color #FFF
        .row .col p
            color #FFF
    .contenedorContenido
        width 80%
</style>
