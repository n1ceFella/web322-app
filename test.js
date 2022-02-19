var obj = {
    name : "Vova",
    date : "1993-12-16"
}

var obj1 = {
    name : "Alena",
    date : "1994-09-06"
}

vova_birth = new Date(obj.date);
alena_birth = new Date(obj1.date);

// vova = JSON.parse(vova_birth);
// alena = JSON.parse(alena_birth);

if(vova_birth > alena_birth)
    console.log("Vova starshe");
else if (vova_birth < alena_birth)
console.log("Alena starshe");
else 
    console.log("ravni");