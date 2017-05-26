

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
       
        

        let maxTemp = samples |> Array.choose (fun sample -> sample.temperature) |> Array.max
        let minTemp = samples |> Array.choose (fun sample -> sample.temperature) |> Array.min

        let maxSalinity = samples |> Array.choose (fun sample -> sample.salinity) |> Array.max
        let minSalinity = samples |> Array.choose (fun sample -> sample.salinity) |> Array.min

        let maxChlorophyll = samples |> Array.choose (fun sample -> sample.discreteChlorophyll) |> Array.max
        let minChlorophyll = samples |> Array.choose (fun sample -> sample.discreteChlorophyll) |> Array.min

        let maxChlorophyll2= samples |> Array.maxBy(fun sample -> sample.discreteChlorophyll)

        let values = 
            [|
            "\n";
            sprintf "var minTemperature = %f;"minTemp;
            sprintf "var maxTemperature = %f;"maxTemp;
            sprintf "var minSalinity = %f;"minSalinity
            sprintf "var maxSalinity = %f;"maxSalinity
            sprintf "var minDiscreteChlorophyll = %f;"minChlorophyll
            sprintf "var maxDiscreteChlorohpyll = %f;"maxChlorophyll
            |]
        
        System.IO.File.WriteAllLines(path, [|json|])
        System.IO.File.AppendAllLines(path, values)





       // printfn "%s" json

    let WriteToFile path (header : string[])( samples : Sample[]) = 
        let header  = header |> String.concat ";"
        let content = samples |> Array.map(fun samples -> Sample.ToCSV samples)
        System.IO.File.WriteAllLines(path, [|header|]);
        System.IO.File.AppendAllLines(path, content);