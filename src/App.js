import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Card,
  Container,
  Columns,
  Heading
} from "react-bulma-components/full"

const App = props => {
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")
  const [locations, setLocations] = useState([])
  const [message, setMessage] = useState("")
  const [images, setImages] = useState([])

  useEffect(() => {
    getLocations()
  }, [])

  async function getLocations() {
    const returnedData = await axios.get(process.env.REACT_APP_API)
    if (returnedData.status === "error") return
    if (returnedData) {
      const { locations } = returnedData.data
      setLocations(locations)
    }
  }

  function handleChange(e) {
    setLocation(e.target.value)
  }

  const selectImage = url => {
    setImage(url)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage("")
    if (!location) {
      setMessage("Please enter a location")
      return
    }

    setImages([])
    const returnedData = await axios.post(`${process.env.REACT_APP_API}images`, { location })
    setImages(returnedData.data.images)
  }

  const addLocation = async () => {
    const returnedData = await axios.post(process.env.REACT_APP_API, {
      location,
      image
    })

    let newLocation = {}
    newLocation.location_id = returnedData.data.location_id
    newLocation.location = location
    newLocation.image = image

    let allLocations = locations
    allLocations.push(newLocation)

    setImages([])
    setLocation("")
    setImage("")
    setLocations(allLocations)
  }

  const handleDelete = e => {
    axios.delete(process.env.REACT_APP_API + e.location_id)
    let allLocations = locations
    for (let i = 0; i < allLocations.length; i++) {
      if (allLocations[i].location_id === e.location_id) {
        allLocations.splice(i, 1)
      }
    }

    setLocations([])
    setTimeout(() => {
      setLocations(allLocations)
    }, 0)
  }

  return (
    <Container>
      <div style={{ height: "20px" }}>{message !== "" && message}</div>
      <form onSubmit={handleSubmit}>
        <Columns>
          <Columns.Column size="three-quarters">
            <div className="field">
              <label className="label">Enter Location</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  onChange={handleChange}
                  value={location}
                  placeholder="Greece"
                />
              </div>
            </div>
          </Columns.Column>
          <Columns.Column>
            <div className="field">
              <label className="label">&#160;</label>
              <div className="control">
                <Button>View Images</Button>
              </div>
            </div>
          </Columns.Column>
        </Columns>
      </form>
      <div style={{ padding: "7px", height: "75px", textAlign: "center" }}>
        {images && images.length !== 0 && !image && (
          <div>Select an image to continue</div>
        )}
      </div>
      <div>
        <div className="columns is-vcentered">
          {images &&
            images.map((image, i) => {
              return (
                <Columns.Column key={image.url}>
                  <div
                    className="card"
                    tabindex={i}
                    onClick={() => selectImage(image.thumbnail.url)}
                    key={image.thumbnail.url}
                  >
                    <div className="card-image">
                      <figure className="image is-4by3">
                        <img src={image.thumbnail.url} />
                      </figure>
                    </div>
                  </div>
                </Columns.Column>
              )
            })}
        </div>
      </div>
      <div style={{ padding: "7px", height: "75px", textAlign: "center" }}>
        {image && <Button onClick={addLocation}>Add Location</Button>}
      </div>
      <Columns>
        {locations &&
          locations.map(location => {
            return (
              <Columns.Column key={location.location_id}>
                <Card>
                  <Columns>
                    <Columns.Column
                      size="two-thirds"
                      style={{ marginLeft: "20px" }}
                    >
                      <Heading>{location.location.toUpperCase()}</Heading>
                    </Columns.Column>
                    <Columns.Column size={3} style={{ textAlign: "right" }}>
                      <div onClick={() => handleDelete(location)}>x</div>
                    </Columns.Column>
                  </Columns>
                  <Card.Content>
                    <div style={{ width: 320 }}>
                      <Card.Image size="2by1" src={location.image} />
                    </div>

                    {/* <div onClick={() => handleDelete(location)}>x</div> */}
                  </Card.Content>
                </Card>
              </Columns.Column>
            )
          })}
      </Columns>
    </Container>
  )
}

export default App
