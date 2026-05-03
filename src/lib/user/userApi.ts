import { apiFetch } from "../apiClients";
import { CreateUserPayload, SearchUserPayload } from "./user.schema";


export async function getUsers(pageNum = 0, search: SearchUserPayload) {
    return await apiFetch(`/users/get?page=${pageNum}&size=${20}&keyword=${search.keyword}&show_deleted=${search.showDeleted}&company_id=${search.company_id ?? 0}`, {
        method: "GET",
        credentials: 'include'
    });
}

export async function getUser(id = 0){
    return await apiFetch(`/users/get/${id}`, {
        method : "GET",
        credentials : 'include'
    })
}

export async function createUser(data : CreateUserPayload){
    return await apiFetch(`/users/create`, {
        method : "POST",
        credentials : 'include',
        body : data,
    })
}

export async function updateUser(id: number, data: Partial<CreateUserPayload>) {
    return await apiFetch(`/users/update/${id}`, {
        method: "PATCH",
        credentials: 'include',
        body: data,
    });
}

export async function deleteUser(id: number) {
    return await apiFetch(`/users/delete/${id}`, {
        method: "DELETE",
        credentials: 'include'
    });
}
