export const state = () =>({
    token: null,
    usuario: null,
    tipoUsuario: null,
    sucursal:null,
    estadoUsuario: 0,
    permisosUser: [],
    urlServe: 'http://127.0.0.1:8000/api/',
    estadoMenu: true,
    colaborador: null
});

export const mutations = {
    cambiarEstadoMenu(state){
        state.estadoMenu = !state.estadoMenu
    },
    guardarColaborador(state, colaborador){
      state.colaborador = colaborador
    },
    guardarToken(state, token){
        state.token = token
    },
    guardarUsuario(state, user){
        state.usuario = user
    },
    guardarTipoUsuario(state, tipo){
        state.tipoUsuario = tipo
    },
    guardarSucursal(state, sucursal){
        state.sucursal = sucursal
    },
    guardarEstadoUsuario(state, estado){
        state.estadoUsuario = estado;
    },
    guardarPermisos(state, permisos){
        state.permisosUser = permisos
    }
}
