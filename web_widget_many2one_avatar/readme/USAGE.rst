In the list view, you just have to set ``widget="many2one_avatar"`` to a
``partner_id`` field definition.

    <field name="partner_id" widget="many2one_avatar"/>

For a user, you can set ``widget="many2one_avatar_user"`` to a ``user_id``
field definition to enable the click-to-chat capability (not backported
actually).

    <field name="user_id" widget="many2one_avatar_user"/>
