import { apiFetch } from "../apiClients";


export async function getUsers(){
    return apiFetch(`/users/get`, {
        method : "GET",
        credentials : 'include'
    })
}
