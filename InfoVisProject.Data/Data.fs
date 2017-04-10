

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
                | Some c -> sprintf "%f" c
            let s = 
                match sample.salinity with
                | None -> ""
                | Some s -> sprintf "%f" s
            let t = 
                match sample.temperature with
                | None -> ""
                | Some t -> sprintf "%f" t


            sprintf("%s;%s;%s;%s;%s")sample.year sample.station c s t



    let GetSamplesPerYearPerStation (year : string) (station : string) (data : Sample[]) = 
        data |> Array.filter(fun sample -> sample.year = year && sample.station = station)
    

    let GetTemperaturePerYearPerStation(year : string) (station : string) (data : Sample[]) = 
        data |> GetSamplesPerYearPerStation year station 
             |> Array.choose (fun sample -> sample.temperature)


    let GetSalinityPerYearPerStation(year : string) (station : string) (data : Sample[]) = 
        data |> GetSamplesPerYearPerStation year station 
             |> Array.choose (fun sample -> sample.salinity)


    let GetChlorophyllPerYearPerStation(year : string) (station : string) (data : Sample[]) = 
        data |> GetSamplesPerYearPerStation year station 
             |> Array.choose (fun sample -> sample.discreteChlorophyll)


    let WriteToFile path (header : string[])(data : string[][]) = 
        let header = header |>String.concat ";"
        let content = data |> Array.map(fun line -> line  |> Array.map  (fun args -> args)
                                                    |> String.concat ";")

        
        System.IO.File.WriteAllLines(path, [|header|]);
        System.IO.File.AppendAllLines(path, content);