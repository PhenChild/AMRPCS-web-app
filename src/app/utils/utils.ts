export default class Utils {
    static rectifyFormat(s: string) {
        const b = s.split(/\D/);
        return b[0] + "-" + b[1] + "-" + b[2] + "T" +
            b[3] + ":" + b[4] + ":" + b[5] + "." +
            b[6].substr(0, 3) + "+00:00";
    }

    static time(s: any) {
        if(!s) return "";
        if(s == "") return "";
        const fecha = new Date(this.rectifyFormat(s));
        return fecha.toTimeString().split(" ").slice(0, 1);
    }

    static date(s: any) {
        if(!s) return "";
        if(s == "") return "";
        const fecha = this.rectifyFormat(s);
        return fecha.split("T")[0];
    }

    static date2(s: any) {
        let fecha = s.replace(",","").split(" ")[0].split("/")
        let mes = (fecha[1].length == 1) ? "0" + fecha[1] : fecha[1];
        let dia = (fecha[0].length == 1) ? "0" + fecha[0] : fecha[0];
        return fecha[2] + "-" + mes + "-" + dia;
    }
}