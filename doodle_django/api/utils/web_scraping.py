import requests
import re, json

out = []

for i in range(1, 5):
    url = "https://www.unical.it/api/news/by-context/1?page=" + str(i) + "&page_size=6&category=9&lang=en"
    response = requests.get(url)

    if response.status_code == 200:
        content = response.json()
            
    # output_file = "src/news.json"
    #     output_file = "src/news.json"

    #     with open(output_file, "w") as file:
    #         file.write(content + "\n")

    # else:
    #     print("Error status code:", response.status_code)
        

    # file_path = output_file 

    # with open(file_path, "r") as json_file:
    #     data = json.load(json_file)
        
    # print(data["results"]["pubblication"])

        for i in range(0, len(content["results"])):
            title = content["results"][i]["publication"]["title"]
            subheading = content["results"][i]["publication"]["subheading"]
            image = content["results"][i]["publication"]["image"]
            alt = content["results"][i]["publication"]["preview_image"]["title"]
            link = content["results"][i]["path"]
            # print(title, subheading, image, alt)
            out.append(
                {
                    "title": title,
                    "subheading": subheading,
                    "image": image,
                    "alt": alt,
                    "link": link
                }
            )
            
file_path = "../../doodle_react/src/news.json" 

with open(file_path, "w") as file:
    json.dump(out, file, indent=4)
    
