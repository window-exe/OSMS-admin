
import * as actionTypes from './actionTypes'

export const setLogin=()=>({
    type:actionTypes.LOGIN,
    data:true
   
})

export const setLogout=()=>({
    type:actionTypes.LOGOUT,
    data:false
})

export const setRole=(data)=>({
    type:actionTypes.MYROLE,
    data
})

export const setCart=(data)=>({
    type:actionTypes.MYCart,
    data
})

export const setLoad=(data)=>({
    type:actionTypes.LOAD,
    data
})


export const setRefresh=(data)=>({
    type:actionTypes.REFRESH,
    data
})

export const setProduct=(data)=>({
    type:actionTypes.PRODUCT,
    data
})

export const setProfile=(data)=>({
    type:actionTypes.PROFILE,
    data
})