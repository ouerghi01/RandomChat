
import { cookies } from 'next/headers';



 export class Cookie{


async setCookie(name:string, value:string) {
    (await cookies()).set(name, value);
}


async getCookie(name: string, ) {
    return (await cookies()).get(name);
}

async deleteCookie(name:string) {
    return (await cookies()).delete(name);
}
}

