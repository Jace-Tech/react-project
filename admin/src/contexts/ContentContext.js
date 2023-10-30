import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategories, addProducts } from "../store/slice/contents";
import { getAllCategories } from "../apis/category";
import { getAllProducts } from "../apis/product";

const ContentContext = createContext()

const ContentContextProvider = ({ children }) => {

  const dispatch = useDispatch()
  const handlePopulateCategories = async () => {
    const result = await getAllCategories()
    if(result && !result?.success) return 
    dispatch(addCategories(result.data))
  }

  const handlePopulateProduct = async () => {
    const result = await getAllProducts()
    console.log("PRODUCTS:", result)

    // UPDATING THE PRODUCTS IN REDUX STORE
    if(result && !result?.success) return 
    dispatch(addProducts(result.data))
  }


  useEffect(() => {
    handlePopulateCategories()
    handlePopulateProduct
    ()
  }, [])

  return (
    <ContentContext.Provider value={{}}>
      { children }
    </ContentContext.Provider>
  )
}

export default ContentContextProvider
export const useContentContext = () => useContext(ContentContext)