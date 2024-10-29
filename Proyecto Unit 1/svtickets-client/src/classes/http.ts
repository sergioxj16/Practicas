// Http: Clase auxiliar para realizar solicitudes HTTP.
// - Implementar métodos para hacer solicitudes GET, POST, PUT y DELETE.
// - Métodos a implementar:
//   - get(url: string, options?: object): Promesa que realiza una solicitud GET.
//   - post(url: string, body: object, options?: object): Promesa que realiza una solicitud POST.
//   - put(url: string, body: object, options?: object): Promesa que realiza una solicitud PUT.
//   - delete(url: string, options?: object): Promesa que realiza una solicitud DELETE.
// - Manejar errores y respuestas del servidor de manera adecuada.

export class Http {
  async ajax<T>(
      method: string,
      url: string,
      headers?: HeadersInit,
      body?: string
  ): Promise<T> {
      const token = localStorage.getItem("token");
      if (token) headers = { ...headers, Authorization: "Bearer " + token };

      const resp = await fetch(url, { method, headers, body });
      if (!resp.ok) throw await resp.json();
      if (resp.status != 204) {
          return await resp.json() as T;
      } else {
          return null as T;
      }
  }

  get<T>(url: string): Promise<T> {
      return this.ajax<T>("GET", url);
  }

  post<T,U>(url: string, data?: U): Promise<T> {
      return this.ajax<T>(
          "POST",
          url,
          {
              "Content-Type": "application/json",
          },
          JSON.stringify(data)
      );
  }

  put<T, U>(url: string, data: U): Promise<T> {
      return this.ajax<T>(
          "PUT",
          url,
          {
              "Content-Type": "application/json",
          },
          JSON.stringify(data)
      );
  }

  delete<T>(url: string): Promise<T> {
      return this.ajax<T>("DELETE", url);
  }
}
