import { apiFetch } from "../apiClients";


export async function getUsers(){
    return await apiFetch(`/users/get`, {
        method : "GET",
        credentials : 'include'
    })
}
