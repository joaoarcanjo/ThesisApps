import { StyleSheet } from "react-native"
import { blackBorder, greyBackgroud } from "../../../assets/styles/colors"

/**
 * Estilos da scroll view com as credenciais
 */
const styleScroolView = StyleSheet.create({
    questionsContainer: {
        borderTopLeftRadius: 20, // Arredonda o canto inferior esquerdo
        borderTopRightRadius: 20, // Arredonda o canto inferior direito        
        borderBottomWidth: 0,
        borderWidth: 2, // Largura da linha na margem
    },
    itemContainer: {
        borderRadius: 20, // Define o raio dos cantos para arredondá-los
        borderWidth: 2, // Largura da linha na margem
        backgroundColor: greyBackgroud, // Cor de fundo
        borderColor: blackBorder,
        marginVertical: 8, // Margem vertical entre os itens
    }
})


export { styleScroolView }