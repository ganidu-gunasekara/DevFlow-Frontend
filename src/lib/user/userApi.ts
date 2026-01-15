import { apiFetch } from "../apiClients";

type UserResponse = {
  email: string;
  name: string;
};

export async function getUser(id : number | string) : Promise<UserResponse>{
    return apiFetch(`/users/${id}`, {
        method : "GET",
        credentials : 'include'
    })
}