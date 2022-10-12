import Usuario from "./models/User";

(async () => {

    await Usuario.sync({ force: true })

    console.log(Usuario);
    await Usuario.create(
        {
            name: "Tcharles",
            age: "300",
            sex:"M",
            email: "tcharlesdavilassen@gmail.com",
            password:"123456"
        });

    // let logado: any = await Usuario.localizaUsuarios('tcharlesdavilassen@gmail.com', '123456');
    // console.log(logado.toJSON());

})()