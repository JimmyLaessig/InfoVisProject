

module Data  

    type Sample = 
        {
            year                : string
            station             : string
            discreteChlorophyll : Option<float>
            salinity            : Option<float>
            temperature         : Option<float>
        }


        static member ToCSV(sample : Sample) = 
            let c = 
                match sample.discreteChlorophyll with
                | None -> ""
                | Some c -> (sprintf "%f" c)
            let s = 
                match sample.salinity with
                | None -> ""
                | Some s -> (sprintf "%f" s)
            let t = 
                match sample.temperature with
                | None -> ""
                | Some t -> (sprintf "%f" t)


            sprintf("%s;%s;%s;%s;%s")sample.year sample.station c s t



    let WriteToJson path samples = 
        let serializer = new System.Web.Script.Serialization.JavaScriptSerializer()
        
        let json = "var data = " + serializer.Serialize(samples) + ";"
        System.IO.File.WriteAllLines(path, [|json|])
        printfn "%s" json

    let WriteToFile path (header : string[])( samples : Sample[]) = 
        let header  = header |> String.concat ";"
        let content = samples |> Array.map(fun samples -> Sample.ToCSV samples)
        System.IO.File.WriteAllLines(path, [|header|]);
        System.IO.File.AppendAllLines(path, content);