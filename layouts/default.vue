<template>
	<div  v-if="token" style="padding: 5px">
		<nav-bar/>
		<nuxt/>
		<div class="btn-wha d-flex align-items-center justify-content-center sticky-top"
			 @click="$store.commit('cambiarEstadoMenu')">
			<vs-icon size="30px" icon="crop_free"></vs-icon>
		</div>

	</div>
	<div v-else>
		<nuxt/>
	</div>
</template>

<script>
	import navBar from "../components/menus/navBar";


	export default {
		components:{
			navBar,
		},
		methods:{
		},
		computed:{
			token: function () {
				return this.$store.state.token
			}
		}
	}
</script>

<style lang="stylus">
	.btn-wha
		display block
		width 40px
		height 40px
		background-color  #32C558
		color #FFF
		position fixed
		right 10px
		margin-top 10px
		border-radius 50%
		cursor pointer
	.btn-wha:hover
		background-color  #FFF
		color  #6BD987
	::-webkit-scrollbar
		width 8px     /* Tamaño del scroll en vertical */
		height 8px
	::-webkit-scrollbar-thumb
		background #6BBA8A
		border-radius 4px
	::-webkit-scrollbar-thumb:hover
		background-color #459966
		box-shadow 0 0 2px 1px rgba(0, 0, 0, 0.2)
	::-webkit-scrollbar-thumb:active
		background-color #2DB161
	::-webkit-scrollbar-track
		background #D0E6D9
		border-radius 4px
	::-webkit-scrollbar-track:hover,
	::-webkit-scrollbar-track:active
		background-color #BBFDD6
</style>
