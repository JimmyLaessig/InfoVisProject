open System
open System.IO

open Data

[<EntryPoint>]
let main argv = 
    let path = "C:\Users\Bernhard\Desktop\SFBay.csv"
    let path_out = "C:\Users\Bernhard\Desktop\SFBay_cleaned.csv"
    let lines = File.ReadAllLines(path)|> Array.map (fun line -> line.Split(';') )
                                        
   
    let header  = Array.head lines
    let header = [|header.[0]; header.[1]; header.[4]; header.[17]; header.[18]|]
    let data    = Array.tail lines

    let timeStamp           = data |> Array.map(fun line ->  line.[0].Substring( 0, 4));
    let stationNumber       = data |> Array.map(fun line -> line.[1]);
    let discreteChlorophyll = data |> Array.map(fun line -> line.[4]);
    let salinity            = data |> Array.map(fun line -> line.[17]);
    let temperature         = data |> Array.map(fun line -> line.[18]);
    
    // Reduced Dimensions
    let data =  timeStamp |> Array.mapi (fun i t -> [|t ; stationNumber.[i];discreteChlorophyll.[i];salinity.[i];temperature.[i]|])

    // Removed measurements before 1977
    let data2 = data |> Array.skipWhile(fun line ->  (line.[2] = ""))




    let nonStandardStations = [|"662";"659";"655";"654";"653";"652";"651";"650";"411";"407";"405";"12.5";"19";"28.5"; "5"; "6"; "7"|]
    // Remove non-standard stations as they were sampled irregularly
    let data2 = data2 |> Array.filter (fun sample -> not (nonStandardStations |> Array.contains sample.[1]))

    let data2 = data2 |>Array.sortBy(fun sample -> String.concat "" [sample.[0] ; sample.[1]])
    
   
    
    let samples = data2 |> Array.map    (fun sample -> 
                                            let c = 
                                                match sample.[2] with 
                                                | ""    -> None
                                                | _     -> Some (System.Double.Parse(sample.[2]))
                                            let s = 
                                                match sample.[3] with 
                                                | ""    -> None
                                                | _     -> Some (System.Double.Parse(sample.[3]))
                                            let t = 
                                                match sample.[4] with 
                                                | ""    -> None
                                                | _     -> Some (System.Double.Parse(sample.[4]))
                                            
                                            {
                                            year                = sample.[0]; 
                                            station             = sample.[1]; 
                                            discreteChlorophyll = c; 
                                            salinity            = s
                                            temperature         = t
                                            }
                                        )

    // Build averaged samples
    Data.WriteToFile path_out header data2
    let samplesAveraged = stationNumber |> Array.distinct 
                                        |> Array.map (fun station -> 
                                                        let years = samples |> Array.distinctBy(fun sample -> sample.year)
                                                                            |> Array.map (fun sample -> sample.year)

                                                        let samplesPerYear = years |> Array.map (fun year -> 
                                                                                
                                                                                let c = Data.GetChlorophyllPerYearPerStation year station samples
                                                                                let s = Data.GetSalinityPerYearPerStation year station samples
                                                                                let t = Data.GetTemperaturePerYearPerStation year station samples
                                                                                
                                                                                
                                                                                let avgC = 
                                                                                    match c with 
                                                                                    | [||] -> printfn "Station: %s" station; None
                                                                                    | _ -> Some (c |> Array.average)

                                                                                let avgS = 
                                                                                    match s with 
                                                                                    | [||] -> None
                                                                                    | _ -> Some (s |> Array.average)

                                                                                let avgT = 
                                                                                    match t with 
                                                                                    | [||] -> None
                                                                                    | _ -> Some (t |> Array.average)
                                                                                                             
                                                                                {
                                                                                    year                = year
                                                                                    station             = station
                                                                                    discreteChlorophyll = avgC
                                                                                    salinity            = avgS
                                                                                    temperature         = avgT
                                                                                }                     
                                                                            )
                                                         
                                                        samplesPerYear
                                                        )
                                            |> Array.concat


    



    Console.ReadKey() |> ignore
    0