export class User{
/** Modelo para los usuarios. */
    /** Id del usuario */
    id!: string;
    
    /** Contraseña del usuario */
    password!: string;

    /** Nombre del usuario */
    nombre!: string;

    /** Apellido del usuario */
    apellido!: string;

    /** Telefono del usuario. */
    telefono!: string;

    /** Email del usuario */
    email!: string;

    /** Rol del usuario */
    role!: string;
    
    /** Fecha de creación */
    createdAt!: string;

    /** Fecha de actualización */
    updatedAt!: string;
}
