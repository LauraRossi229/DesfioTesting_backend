import { userModel } from "../models/users.models.js";
import {sendPasswordResetEmail} from "../utils/mails.js"; // Agrega la función de envío de correos}
import {generateResetToken} from "../utils/passwordReset.js"

// ... (código existente)

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    console.log('Usuario encontrado:', user);

    const resetToken = generateResetToken(user);
    console.log('Token de restablecimiento generado:', resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora

    await user.save();

    // Envía el correo electrónico con el enlace para restablecer la contraseña
    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).send({ mensaje: "Correo de restablecimiento enviado con éxito" });
  } catch (error) {
    console.log('Error en la solicitud de restablecimiento de contraseña:', error.message);
    return res.status(500).send({ error: `Error en la solicitud de restablecimiento de contraseña: ${error}` });
  }
};


export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Enlace no válido o expirado" });
    }

    // Verificar si la nueva contraseña es diferente de la actual
    if (validatePassword(newPassword, user.password)) {
      return res.status(400).send({ error: "No puedes usar la misma contraseña" });
    }

    // Actualizar la contraseña y limpiar los campos de restablecimiento
    user.password = createHash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).send({ mensaje: "Contraseña restablecida con éxito" });
  } catch (error) {
    return res.status(500).send({ error: `Error en el restablecimiento de contraseña: ${error}` });
  }
};

export const changeUserRole = async (req, res) => {
  const { uid } = req.params;
  const { newRole } = req.body;

  try {
    console.log("User ID:", uid);
    console.log("New Role:", newRole);

    const user = await userModel.findByIdAndUpdate(uid, { rol: newRole }, { new: true });

    if (user) {
      console.log("User Updated:", user);
      return res.status(200).send(user);
    }

    console.log("User Not Found");
    res.status(404).send({ error: "Usuario no encontrado" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: `Error al cambiar el rol del usuario: ${error}` });
  }
};


export const getUsers = async (req, res) => {
  try {
    const user = await userModel.find();

    if (user) {
      return res.status(200).send(user);
    }
    res.status(400).send({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).send({ error: `Error en consultar el usuario ${error}` });
  }
};

export const getUserbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = await userModel.findById(id);

    if (userId) {
      return res.status(200).send(userId);
    }
    res.status(404).send({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).send({ error: `Error en consultar usuario ${error}` });
  }
};


export const putUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const actUser = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });

    if (actUser) {
      return res.status(200).send(actUser);
    }
    res.status(404).send({ error: "Usuario no encontrado" });
  } catch (error) {
    res.status(500).send({ error: `Error en actualizar el usuario ${error}` });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (user) {
      res.status(200).send({ user });
    } else {
      res.status(404).send({ error: "Error en eliminar usuario" });
    }
  } catch (error) {
    res.status(400).send({ error: "Error en eliminar usuario" });
  }
};
