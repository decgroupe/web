odoo.define('mail.Many2OneAvatarUser', function (require) {
    "use strict";

    // This module defines an extension of the Many2OneAvatar widget, which is
    // integrated with the messaging system. The Many2OneAvatarUser is designed
    // to display people, and when the avatar of those people is clicked, it
    // opens a DM chat window with the corresponding user.
    //
    // This widget is supported on many2one fields pointing to 'res.users'.
    //
    // Usage:
    //   <field name="user_id" widget="many2one_avatar_user"/>
    //
    // The widget is designed to be extended, to support many2one fields pointing
    // to other models than 'res.users'.

    var core = require("web.core");
    const fieldRegistry = require('web.field_registry');
    var relational_fields = require('web.relational_fields');

    var QWeb = core.qweb;

    /**
     * Widget Many2OneAvatar is only supported on many2one fields pointing to a
     * model which inherits from 'image.mixin'. In readonly, it displays the
     * record's image next to the display_name. In edit, it behaves exactly like a
     * regular many2one widget.
     */
    const Many2OneAvatar = relational_fields.FieldMany2One.extend({
        _template: 'web.Many2OneAvatar',

        init() {
            this._super.apply(this, arguments);
            if (this.mode === 'readonly') {
                this.template = null;
                this.tagName = 'div';
                this.className = 'o_field_many2one_avatar';
                // disable the redirection to the related record on click, in readonly
                this.noOpen = true;
            }
        },

        //--------------------------------------------------------------------------
        // Private
        //--------------------------------------------------------------------------

        /**
         * @override
         */
        _renderReadonly() {
            this.$el.empty();
            if (this.value) {
                this.$el.html(QWeb.render(this._template, {
                    url: `/web/image/${this.field.relation}/${this.value.res_id}/image/128x128`,
                    value: this.m2o_value,
                }));
            }
        },
    });

    const Many2OneAvatarUser = Many2OneAvatar.extend({
        events: Object.assign({}, Many2OneAvatar.prototype.events, {
            'click .o_m2o_avatar': '_onAvatarClicked',
        }),
        // This widget is only supported on many2ones pointing to 'res.users'
        supportedModels: ['res.users'],

        init() {
            this._super(...arguments);
            if (!this.supportedModels.includes(this.field.relation)) {
                throw new Error(`This widget is only supported on many2one fields pointing to ${JSON.stringify(this.supportedModels)}`);
            }
            if (this.mode === 'readonly') {
                this.className += ' o_clickable_m2o_avatar';
            }
        },

        //----------------------------------------------------------------------
        // Handlers
        //----------------------------------------------------------------------

        /**
         * When the avatar is clicked, open a DM chat window with the
         * corresponding user.
         *
         * @private
         * @param {MouseEvent} ev
         */
        async _onAvatarClicked(ev) {
            ev.stopPropagation(); // in list view, prevent from opening the record
        }
    });

    const KanbanMany2OneAvatarUser = Many2OneAvatarUser.extend({
        _template: 'mail.KanbanMany2OneAvatarUser',
    });

    fieldRegistry.add('many2one_avatar', Many2OneAvatar);
    fieldRegistry.add('many2one_avatar_user', Many2OneAvatarUser);
    fieldRegistry.add('kanban.many2one_avatar_user', KanbanMany2OneAvatarUser);

    return {
        Many2OneAvatar,
        Many2OneAvatarUser,
        KanbanMany2OneAvatarUser,
    };
});
